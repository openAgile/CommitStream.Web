import uuid from 'uuid-v4';
import SvnCommitMalformedError from '../../middleware/svnCommitMalformedError';
import VcsFamilies from '../helpers/vcsFamilies';

const svnTranslator = {
  family: VcsFamilies.Svn,
  canTranslate(request) {
      if (hasCorrectHeaders(request.headers)) {
        return true;
      }
      return false;
    },
  translatePush(commitEvent, instanceId, digestId, inboxId) {
      try {
        //svn does not have a branch information
        const branch = "";
        const revisionNumber = commitEvent.pretext.split("rev. ");
        const repository = {
          name: commitEvent.repository.substr(commitEvent.repository.lastIndexOf('/') + 1),
          url: commitEvent.repository
        };

        const commit = {
          //svn it doesn't contains a commit id so we can use the revision number
          sha: "r" + revisionNumber[revisionNumber.length-1],
          commit: {
            author: {
              'name': commitEvent.author,
              'email': ""
            },
            committer: {
              name: commitEvent.author,
              //svn does not have email information
              email: "",
              date: commitEvent.committer.date
            },
            message: commitEvent.message
          },
          html_url: commitEvent.html_url,
          repository: repository,
          branch: branch,
          originalMessage: commitEvent
        };
        return [{
          eventId: uuid(),
          eventType: svnTranslator.family + 'CommitReceived',
          data: commit,
          metadata: {
            instanceId: instanceId,
            digestId: digestId,
            inboxId: inboxId
          }
        }];
      } catch (ex) {
        throw new SvnCommitMalformedError(ex, commitEvent);
      }
    },
  getProperties(event) {
      const props = {
        repo: event.repository.name,
        repoHref: event.repository.url,
        branchHref: ''
      };
      return props;
    }
};

const hasCorrectHeaders = (headers) => headers.hasOwnProperty('cs-svn-event')
&& headers['cs-svn-event'] === 'Commit Event';

export default svnTranslator;