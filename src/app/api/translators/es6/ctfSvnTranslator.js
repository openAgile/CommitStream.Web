import uuid from 'uuid-v4';
import CtfSvnCommitMalformedError from '../../middleware/ctfSvnCommitMalformedError';
import VcsFamilies from '../helpers/vcsFamilies';

const ctfSvnTranslator = {
  family: VcsFamilies.CtfSvn,
  canTranslate(request) {
      if (hasCorrectHeaders(request.headers)) {
        return true;
      }
      return false;
    },
  translatePush: function translatePush(ctfEvent, instanceId, digestId, inboxId) {
    try {
        // svn does not have a branch information
        var branch = '';
        var repository = {
            id: ctfEvent.repository.id,
            name: ctfEvent.repository.name,
            url: ctfEvent.repository.url
          };
        var revision = ctfEvent.revision;
        var commit = {
            // svn doesn't contains a commit id so we can use the revision number
            sha: 'r' + revision.id,
            commit: {
                author: {
                    'name': revision.author.name,
                    'email': revision.author.email
                  },
                committer: {
                    name: revision.author.name,
                    email: revision.author.email,
                    date: revision.timestamp
                  },
                message: revision.message
              },
            html_url: revision.url,
            repository: repository,
            branch: branch,
            originalMessage: ctfEvent
          };
        return [{
          eventId: uuid(),
          eventType: ctfSvnTranslator.family + 'CommitReceived',
          data: commit,
          metadata: {
              instanceId: instanceId,
              digestId: digestId,
              inboxId: inboxId
            }
        }];
      } catch (ex) {
        throw new CtfSvnCommitMalformedError(ex, ctfEvent);
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
&& headers['x-ctf-scm'] === 'subversion';

export default ctfSvnTranslator;