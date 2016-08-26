  import uuid from 'uuid-v4';
  import GitLabCommitMalformedError from '../../middleware/gitLabCommitMalformedError';
  import getProperties from './getProperties';
  import branchNameParse from './branchNameParse';

  const hasCorrectHeaders = (headers) => headers.hasOwnProperty('x-gitlab-event')
    && headers['x-gitlab-event'] === 'Push Hook';

  const gitLabTranslator = {
    family: 'GitLab',
    canTranslate(request) {
      // gitLab does not have a pusheEvent.repository.id field, and github does
      // gitLab does not have a commit.committer object, and github does
      if (hasCorrectHeaders(request.headers)) {
        return true;
      }
      return false;
    },
    translatePush(pushEvent, instanceId, digestId, inboxId) {
      try {
        const branch = branchNameParse(pushEvent.ref);
        const repository = {
          // gitLab does not have a repository id
          // id: pushEvent.repository.id,
          name: pushEvent.repository.name
        };

        const events = pushEvent.commits.map(aCommit => {
          const commit = {
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
        throw new GitLabCommitMalformedError(ex, pushEvent);
      }
    },
    getProperties(event) {
      return getProperties(event, '/commit', 'tree');
    }
};

export default gitLabTranslator;