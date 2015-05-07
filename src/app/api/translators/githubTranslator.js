(function(githubTranslator) {
  var _ = require('underscore'),
    uuid = require('uuid-v4'),
    csError = require('../../middleware/csError');

  var GithubEventNotPresent = csError.createCustomError('GithubEventNotPresent', function() {
    var message = 'The header x-github-event is required.';
    var errors = [message];
    GithubEventNotPresent.prototype.constructor.call(this, errors, 400);
  });

  var InvalidGithubEvent = csError.createCustomError('InvalidGithubEvent', function(eventType) {
    var message = 'Invalid x-github-event: ' + eventType;
    var errors = [message];
    InvalidGithubEvent.prototype.constructor.call(this, errors, 400);
  });    

  githubTranslator.GitHubCommitMalformedError = csError.createCustomError('GitHubCommitMalformedError', function(error, pushEvent) {
    this.originalError = error;
    var errors = [error.toString()];
    this.pushEvent = pushEvent;
    githubTranslator.GitHubCommitMalformedError.prototype.constructor.call(this, errors, 400);
  });

  githubTranslator.validate = function(req) {
    if (!req.headers.hasOwnProperty('x-github-event')) {
      throw new GithubEventNotPresent();
    }
    var eventType = req.headers['x-github-event'];
    if (eventType !== 'push' && eventType !== 'ping') {
      throw new InvalidGithubEvent(eventType);
    }
    return true;
  };

  githubTranslator.hasCommits = function(req) {
    return req.headers['x-github-event'] === 'push';
  };

  githubTranslator.respondToNonCommitsMessage = function(req, res) {
    res.json({
      message: 'Pong.'
    });    
  };

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
      var otherEx = new githubTranslator.GitHubCommitMalformedError(ex, pushEvent);
      //console.log(otherEx, otherEx.originalError.stack);            
      throw otherEx;
    }
  };
  
}(module.exports));