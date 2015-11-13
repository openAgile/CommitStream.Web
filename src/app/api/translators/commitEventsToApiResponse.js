//TODO: convert to ES6
(function() {
  var _ = require('underscore'),
    moment = require('moment');

  var getRepoInfo = function(family, commitUrl) {

    var repoArray;

    if (family === 'GitHub' || family === 'GitLab') {
      repoArray = commitUrl.split('/commit')[0].split('/');
    } else if (family === 'Bitbucket') {
      repoArray = commitUrl.split('/commits')[0].split('/');
    } else if (family === 'VsoGit') {
      repoArray = [];
      var components = commitUrl.match(/http.?:\/\/(.*?)\..*?_git\/(.*?)\/commit/);
      var serverUrlMatch = commitUrl.match(/(http.?:)\/\/(.*?_git)\//);
      if (components !== null && serverUrlMatch !== null) {
        repoArray = [serverUrlMatch[1], '', serverUrlMatch[2], components[1], components[2]];
      }
    } else {
      throw 'Invalid family';
    }

    var r = {};
    r.repoName = repoArray.pop();
    r.repoOwner = repoArray.pop();
    r.serverUrl = repoArray.pop();

    if (repoArray.pop() === '') {
      r.serverUrl = repoArray.pop() + '//' + r.serverUrl;
    }

    return r;
  };

  var getFamily = function(eventType) {
    return eventType.slice(0, -14);
  };

  var getRepoHref = function(family, repoInfo) {
    if (family === 'VsoGit') {
      return repoInfo.serverUrl + '/' + repoInfo.repoName;
    }
    // https://serverUrl/repoOwner/repoName
    return repoInfo.serverUrl + '/' + repoInfo.repoOwner + '/' + repoInfo.repoName;
  };

  var getBranchHref = function(family, repoHref, branch) {
    if (family === 'GitHub' || family === 'GitLab') {
      // http://serverUrl/repoOwner/reponame/tree/branchName
      return repoHref + '/tree/' + branch;
    }

    if (family === 'Bitbucket') {
      // https://bitbucket.org/kunzimariano/test/branch/master for bitbucket
      return repoHref + '/branch/' + branch;
    }

    if (family === 'VsoGit') {
      return repoHref + '/#version=GB' + encodeURIComponent(branch);
    }

    throw 'Invalid family';
  };

  module.exports = function(entries) {
    var commits = [];
    _.each(entries, function(entry) {
      try {
        var e = JSON.parse(entry.data);
        var family = getFamily(entry.eventType);
        var repoInfo = getRepoInfo(family, e.html_url);

        commits.push({
          commitDate: e.commit.committer.date,
          timeFormatted: moment(e.commit.committer.date).fromNow(),
          author: e.commit.committer.name,
          sha1Partial: e.sha.substring(0, 6),
          family: family,
          action: 'committed',
          message: e.commit.message,
          commitHref: e.html_url,
          repo: repoInfo.repoOwner + '/' + decodeURIComponent(repoInfo.repoName),
          branch: e.branch,
          branchHref: getBranchHref(family, getRepoHref(family, repoInfo), e.branch),
          repoHref: getRepoHref(family, repoInfo)
        });
      } catch (ex) {
        console.log(ex);
      }
    });
    var response = {
      commits: commits
    };
    return response;
  };
})();
