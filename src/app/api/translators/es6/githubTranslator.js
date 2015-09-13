(function(githubTranslator) {
  var _ = require('underscore'),
    util = require('util'),
    uuid = require('uuid-v4'),
    CSError = require('../../middleware/csError');

  //TODO: do we want this kind of library to know about status codes?
  class GitHubCommitMalformedError extends CSError {
    constructor(error, pushEvent) {
      super([error.toString()])
      this.originalError = error;
      this.pushEvent = pushEvent;      
    }
  }

  githubTranslator.translatePush = function(pushEvent, instanceId, digestId, inboxId) {
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
            instanceId: instanceId,
            digestId: digestId,
            inboxId: inboxId
          }
        };
      });
      return events;
    } catch (ex) {
      var otherEx = new GitHubCommitMalformedError(ex, pushEvent);
      //console.log(otherEx, otherEx.originalError.stack);
      throw otherEx;
    }
  };

  githubTranslator.canTranslate = function(request) {
    var headers = request.headers;
    if (headers.hasOwnProperty('x-github-event') && headers['x-github-event'] === 'push') {
      return true;
    }
    return false;
  };

})(module.exports);