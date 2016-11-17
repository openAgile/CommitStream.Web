  import uuid from 'uuid-v4';
  import P4vCommitMalformedError from '../../middleware/p4vCommitMalformedError';
  import VcsFamilies from '../helpers/vcsFamilies';

  const hasCorrectHeaders = (headers) => headers.hasOwnProperty('cs-p4v-event')
    && headers['cs-p4v-event'] === 'Commit Event';

  const p4vTranslator = {
    family: VcsFamilies.P4V,
    canTranslate(request) {
      if (hasCorrectHeaders(request.headers)) {
        return true;
      }
      return false;
    },
    translatePush(commitEvent, instanceId, digestId, inboxId) {
      try {
        //p4v does not have a branch information
        const branch = "";
        //TODO: CHECK WHAT ARE GOING TO SHOW HERE
        const repository = {
          name: commitEvent.repository.substr(commitEvent.repository.lastIndexOf('/') + 1),
          url: commitEvent.repository
        };

        const commit = {
          sha: "r#:" + commitEvent.revision,
          commit: {
            author: {
              'name': commitEvent.author,
              'email': ""
            },
            committer: {
              name: commitEvent.author,
              //p4 does not have email information
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
          eventType: p4vTranslator.family + 'CommitReceived',
          data: commit,
          metadata: {
            instanceId: instanceId,
            digestId: digestId,
            inboxId: inboxId
          }
        }];
      } catch (ex) {
        throw new P4vCommitMalformedError(ex, commitEvent);
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

export default p4vTranslator;
