import _ from 'underscore';
import uuid from 'uuid-v4';
import BitbucketCommitMalformedError from '../../middleware/bitbucketCommitMalformedError';
import getProperties from './getProperties';
import VcsFamilies from '../helpers/vcsFamilies';

const bitbucketTranslator = {
  family: VcsFamilies.Bitbucket,
  hasCorrectHeaders(headers) {
    return headers.hasOwnProperty('x-event-key') && headers['x-event-key'] === 'repo:push';
  },
  canTranslate(request) { 
    return this.hasCorrectHeaders(request.headers);
  },
  translatePush(pushEvent, instanceId, digestId, inboxId) {
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
          eventType: bitbucketTranslator.family + 'CommitReceived',
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
  },
  getProperties(event) {
    return getProperties(event, '/commits', 'branch');
  }
};

export default bitbucketTranslator;
