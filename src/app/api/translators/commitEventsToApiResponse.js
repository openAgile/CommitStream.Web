//TODO: convert to ES6
(function() {
  var _ = require('underscore'),
    moment = require('moment'),
    translatorFactory = require('./translatorFactory');

  var getFamily = function(eventType) {
    return eventType.slice(0, -14);
  };

  module.exports = function(entries) {
    var commits = [];
    _.each(entries, function(entry) {
      try {
        var e = JSON.parse(entry.data);
        var family = getFamily(entry.eventType);
        var translator = translatorFactory.getByFamily(family);
        var props = translator.getProperties(e);

        commits.push({
          commitDate: e.commit.committer.date,
          timeFormatted: moment(e.commit.committer.date).fromNow(),
          author: e.commit.committer.name,
          sha1Partial: e.sha.substring(0, 6),
          family: family,
          action: 'committed',
          message: e.commit.message,
          commitHref: e.html_url,
          repo: props.repo,
          branch: e.branch,
          branchHref: props.branchHref,
          repoHref: props.repoHref
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