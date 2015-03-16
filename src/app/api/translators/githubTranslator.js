(function(githubTranslator) {
  var _ = require('underscore'),
    util = require('util'),
    uuid = require('uuid-v4');

  githubTranslator.GitHubCommitMalformedError = function(error) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.statusCode = 400,
    this.message = 'Known Error',
    this.originalError = error;
  };

  util.inherits(githubTranslator.GitHubCommitMalformedError, Error);

  githubTranslator.translatePush = function(pushEvent, digestId) {
    try {
      var branch = pushEvent.ref.split('/').pop();
      var repository = {
        id: pushEvent.repository.id,
        name: pushEvent.repository.name
      };

      var events = _.map(pushEvent.commits, function(aCommit) {
        var commit = {
          sha: aCommit.id,
          commit: {
            author: aCommit.author,
            committer: {
              name: aCommit.committer.name,
              email: aCommit.committer.email,
              date: aCommit.timestamp
            },
            message: aCommit.message
          },
          html_url: aCommit.url,
          repository: repository,
          branch: branch,
          originalMessage: aCommit
        };
        return {
          eventId: uuid(),
          eventType: 'GitHubCommitReceived',
          data: commit,
          metadata: {
            digestId: digestId
          }
        };
      });
      return events;
    } catch (ex) {
      var otherEx = new githubTranslator.GitHubCommitMalformedError(ex);
      console.log(JSON.stringify(otherEx));
      throw otherEx;
    }

  }
})(module.exports);