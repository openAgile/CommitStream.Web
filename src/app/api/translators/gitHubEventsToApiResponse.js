(function() {
  var _ = require('underscore'),
    moment = require('moment');

  var getRepoOwnerName = function(commit) {
    var repoArray = commit.html_url.split('/commit')[0].split('/');
    return result = {
      repoName: repoArray.pop(),
      repoOwner: repoArray.pop()
    }
  };

  module.exports = function(entries) {
    var commits = _.map(entries, function(entry) {
      var e = JSON.parse(entry.data);
      var repo = getRepoOwnerName(e);
      return {
        commitDate: e.commit.committer.date,
        timeFormatted: moment(e.commit.committer.date).fromNow(),
        author: e.commit.committer.name,
        sha1Partial: e.sha.substring(0, 6),
        family: entry.eventType.slice(0, -14),
        action: "committed",
        message: e.commit.message,
        commitHref: e.html_url,
        repo: repo.repoOwner + '/' + repo.repoName,
        branch: e.branch,
        branchHref: "https://github.com/" + repo.repoOwner + "/" + repo.repoName + "/tree/" + e.branch,
        repoHref: "https://github.com/" + repo.repoOwner + "/" + repo.repoName
      };

      // github push events include svn_url, could that be used in place of
      // "https://github.com/" + repo.repoOwner + "/" + repo.repoName
      // if so, has that been captured for all historical commits?

      // comperable gitlab branchHref
      // http://v1cs-gitlab-dev.cloudapp.net/user/gitlab-project-test/tree/master
      // comperable gitlab repoHref
      // http://v1cs-gitlab-dev.cloudapp.net/user/gitlab-project-test
      //
      // similarly for gitlab, it sends a homepage property, could this be the counterpart
      // to svn_url from the github payload.

    });
    var response = {
      commits: commits
    };
    return response;
  };
})();