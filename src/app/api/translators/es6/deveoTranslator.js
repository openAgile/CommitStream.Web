import util from 'util';
import uuid from 'uuid-v4';
import CSError from '../../middleware/csError';
import getProperties from './getProperties';
import branchNameParse from './branchNameParse';

//TODO: do we want this kind of library to know about status codes?
class DeveoCommitMalformedError extends CSError {
  constructor(error, pushEvent) {
    super(['There was an unexpected error when processing your Deveo push event.']);
    this.originalError = error;
    this.pushEvent = pushEvent;
  }
}

let deveoTranslator = {
  family: 'Deveo',
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
          eventType: 'DeveoCommitReceived',
          data: commit,
          metadata: {
            instanceId,
            digestId,
            inboxId
          }
        };
      });
    } catch (ex) {
      var otherEx = new DeveoCommitMalformedError(ex, pushEvent);
      //console.log(otherEx, otherEx.originalError.stack);
      throw otherEx;
    }
  },
  canTranslate(request) {
    const headers = request.headers;
    return headers.hasOwnProperty('x-deveo-event') && headers['x-deveo-event'] === 'push';
  },
  getProperties(event) {
    return getProperties(event, '/commit', 'tree');
  }
};

export default deveoTranslator;
