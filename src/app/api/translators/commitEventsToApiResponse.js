(function() {
  var _ = require('underscore'),
    moment = require('moment');

  var getRepoInfo = function(commitUrl) {
    var repoArray = commitUrl.split('/commit')[0].split('/');

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

  var getRepoHref = function(repoInfo) {
    // https://serverUrl/repoOwner/repoName
    return repoInfo.serverUrl + '/' + repoInfo.repoOwner + '/' + repoInfo.repoName;
  }

  var getBranchHref = function(repoHref, branch) {
    // http://serverUrl/repoOwner/reponame/tree/branch
    return repoHref + '/tree/' + branch;
  }

  module.exports = function(entries) {
    var commits = _.map(entries, function(entry) {
      var e = JSON.parse(entry.data);
      var repoInfo = getRepoInfo(e.html_url);
      var family = getFamily(entry.eventType);

      return {
        commitDate: e.commit.committer.date,
        timeFormatted: moment(e.commit.committer.date).fromNow(),
        author: e.commit.committer.name,
        sha1Partial: e.sha.substring(0, 6),
        family: family,
        action: "committed",
        message: e.commit.message,
        commitHref: e.html_url,
        repo: repoInfo.repoOwner + '/' + repoInfo.repoName,
        branch: e.branch,
        branchHref: getBranchHref(getRepoHref(repoInfo), e.branch),
        repoHref: getRepoHref(repoInfo)
      };
    });
    var response = {
      commits: commits
    };
    return response;
  };
})();
