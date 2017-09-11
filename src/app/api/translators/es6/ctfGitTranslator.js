import uuid from 'uuid-v4';
import CtfGitCommitMalformedError from '../../middleware/ctfGitCommitMalformedError';
import branchNameParse from './branchNameParse';
import VcsFamilies from '../helpers/vcsFamilies';

const ctfGitTranslator = {
  family: VcsFamilies.CtfGit,
  canTranslate(request) {
      if (hasCorrectHeaders(request.headers)) {
        return true;
      }
      return false;
    },
  translatePush: function translatePush(ctfEvent, instanceId, digestId, inboxId) {
    try {
        const branch = branchNameParse(ctfEvent.ref);
        const repository = {
            id: ctfEvent.repository.id,
            name: ctfEvent.repository.name,
            url: ctfEvent.repository.url
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
                eventType: ctfGitTranslator.family + 'CommitReceived',
                data: commit,
                metadata: {
                    instanceId,
                    digestId,
                    inboxId
                  }
              };
          });
      } catch (ex) {
        throw new _middlewareCtfGitCommitMalformedError2['default'](ex, ctfEvent);
      }
    },
  getProperties: function getProperties(event) {
      var props = {
        repo: event.repository.name,
        repoHref: event.repository.url,
        branchHref: ''
      };
      return props;
    }
};

const hasCorrectHeaders = (headers) => headers.hasOwnProperty('x-ctf-scm')
&& headers['x-ctf-scm'] === 'git';

export default ctfGitTranslator;