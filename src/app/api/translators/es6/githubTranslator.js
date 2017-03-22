import uuid from 'uuid-v4';
import getProperties from './getProperties';
import GitHubCommitMalformedError from '../../middleware/gitHubCommitMalformedError';
import branchNameParse from './branchNameParse';
import VcsFamilies from '../helpers/vcsFamilies';

let githubTranslator = {
  family: VcsFamilies.GitHub,
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
          eventType: githubTranslator.family + 'CommitReceived',
          data: commit,
          metadata: {
            instanceId,
            digestId,
            inboxId
          }
        };
      });
    } catch (ex) {
      throw new GitHubCommitMalformedError(ex, pushEvent);
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
