import _ from 'underscore';
import uuid from 'uuid-v4';
import BitbucketCommitMalformedError from '../../middleware/bitbucketCommitMalformedError';

let bitbucketTranslator = {};

let hasCorrectHeaders = headers => headers.hasOwnProperty('x-event-key') && headers['x-event-key'] === 'repo:push';

bitbucketTranslator.canTranslate = request => hasCorrectHeaders(request.headers);

bitbucketTranslator.translatePush = (pushEvent, instanceId, digestId, inboxId) => {
  try {
    let latestCommit = pushEvent.push.changes[0].new;
    //TODO: we only have the date of the newest commit in the push.
    //Do we want to use it for every commit?
    let branch = latestCommit.name;
    let date = latestCommit.target.date;
    let repository = {
      id: pushEvent.repository.uuid,
      name: pushEvent.repository.name
    };
    // Bitbucket puts the newest commits firts hence the reverse
    let commits = pushEvent.push.changes[0].commits.reverse();
    let events = _.map(commits, aCommit => {
      const author = aCommit.author;
      const email = author.raw;
      let display_name, username;
      if (_.has(author, 'user') && _.has(author.user, 'display_name')) display_name = author.user.display_name;
      else display_name = 'unknown';
      if (_.has(author, 'user') && _.has(author.user, 'username')) username = author.user.username;
      else username = 'unknown';
      let commit = {
        sha: aCommit.hash,
        commit: {
          author: username,
          // bitbucket does not have a commit.committer object. Using the same thing as author for now.
          committer: {
            name: display_name,
            email: email,
            date
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
    throw new BitbucketCommitMalformedError(ex, pushEvent);
  }
};

export default bitbucketTranslator;
