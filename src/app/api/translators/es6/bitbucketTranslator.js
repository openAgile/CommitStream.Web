import _ from 'underscore';
import uuid from 'uuid-v4';

let bitbucketTranslator = {};

//X-Event-Key: repo:push
let hasCorrectHeaders = headers => headers.hasOwnProperty('User-Agent') && headers['User-Agent'] === 'Bitbucket-Webhooks/2.0';

bitbucketTranslator.canTranslate = request => hasCorrectHeaders(request.headers);

bitbucketTranslator.translatePush = (pushEvent, instanceId, digestId, inboxId) => {
  try {
    let branch = pushEvent.push.changes[0].new.name;
    let repository = {
      id: pushEvent.repository.uuid,
      name: pushEvent.repository.name
    };
    let events = _.map(pushEvent.push.changes[0].commits, aCommit => {
      let commit = {
        sha: aCommit.hash,
        commit: {
          author: aCommit.author.user.username,
          // bitbucket does not have a commit.committer object. Using the same thing as author for now.
          committer: {
            name: aCommit.author.user.display_name,
            email: aCommit.author.raw,
            date: ''
          },
          message: aCommit.message
        },
        html_url: aCommit.links.html.href,
        repository,
        branch,
        originalMessage: aCommit
      };
      return {
        eventId: uuid(),
        eventType: 'BitbucketCommitReceived',
        data: commit,
        metadata: {
          instanceId,
          digestId,
          inboxId
        }
      };
    });

    return events;
  } catch (ex) {
    console.log(ex);
    throw ex;
    //throw new BitbucketCommitMalformedError(ex, pushEvent);
  }
};

export default bitbucketTranslator;