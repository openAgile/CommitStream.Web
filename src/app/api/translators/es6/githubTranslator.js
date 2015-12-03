import util from 'util';
import uuid from 'uuid-v4';
import CSError from '../../middleware/csError';
import getProperties from './getProperties';
import branchNameParse from './branchNameParse';

//TODO: do we want this kind of library to know about status codes?
class GitHubCommitMalformedError extends CSError {
  constructor(error, pushEvent) {
    super(['There was an unexpected error when processing your GitHub push event.']);
    this.originalError = error;
    this.pushEvent = pushEvent;
  }
}

let githubTranslator = {
  family: 'GitHub',
  translatePush(pushEvent, instanceId, digestId, inboxId) {
    try {
      const branch = branchNameParse(pushEvent.ref);
      const repository = {
        id: pushEvent.repository.id,
        name: pushEvent.repository.name
      };

      return pushEvent.commits.map(aCommit => {
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
          repository,
          branch,
          originalMessage: aCommit
        };
        return {
          eventId: uuid(),
          eventType: 'GitHubCommitReceived',
          data: commit,
          metadata: {
            instanceId,
            digestId,
            inboxId
          }
        };
      });
    } catch (ex) {
      var otherEx = new GitHubCommitMalformedError(ex, pushEvent);
      //console.log(otherEx, otherEx.originalError.stack);
      throw otherEx;
    }
  },
  canTranslate(request) {
    const headers = request.headers;
    return headers.hasOwnProperty('x-github-event') && headers['x-github-event'] === 'push';
  },
  getProperties(event) {
    return getProperties(event, '/commit', 'tree');
  }
};

export default githubTranslator;
