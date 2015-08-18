((gitLabTranslator) => {
  let _ = require('underscore'),
    uuid = require('uuid-v4'),
    GitLabCommitMalformedError = require('../../middleware/gitLabCommitMalformedError');

  let hasCorrectHeaders = (headers) => {
    return headers.hasOwnProperty('x-gitlab-event') && headers['x-gitlab-event'] === 'Push Hook';
  }

  gitLabTranslator.canTranslate = (request) => {
    // gitLab does not have a pusheEvent.repository.id field, and github does
    // gitLab does not have a commit.committer object, and github does
    if (hasCorrectHeaders(request.headers)) {
      return true;
    }
    return false;
  }

  gitLabTranslator.translatePush = (pushEvent, instanceId, digestId, inboxId) => {
    try {
      let branch = pushEvent.ref.split('/').pop();
      let repository = {
        // gitLab does not have a repository id
        // id: pushEvent.repository.id,
        name: pushEvent.repository.name
      };

      let events = _.map(pushEvent.commits, function(aCommit) {
        let commit = {
          sha: aCommit.id,
          commit: {
            author: aCommit.author,
            // gitLab does not have a commit.committer object. Using the same thing as author for now.
            // committer: {
            //   name: aCommit.committer.name,
            //   email: aCommit.committer.email,
            //   date: aCommit.timestamp
            // },
            committer: {
              name: aCommit.author.name,
              email: aCommit.author.email,
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
          eventType: 'GitLabCommitReceived',
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
      console.log(ex);
      throw new GitLabCommitMalformedError(ex, pushEvent);
    }
  }

})(module.exports);
