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
        id: pushEvent.repository.uuid,
        name: pushEvent.repository.name,
      };

      return pushEvent.commits.map(aCommit => {
        var commit = {
          sha: aCommit.id,
          commit: {
            author: pushEvent.repository.type == 'subversion' ? pushEvent.pusher.display_name : aCommit.author.name,
            committer: {
              name: pushEvent.repository.type == 'subversion' ? pushEvent.pusher.display_name : aCommit.author.name,
              email: aCommit.committer.email,
              date: aCommit.timestamp,
            },
            message: aCommit.message,
          },
          html_url: aCommit.url,
          repository,
          branch,
          originalMessage: aCommit,
        };
        return {
          eventId: uuid(),
          eventType: 'DeveoCommitReceived',
          data: commit,
          metadata: {
            instanceId,
            digestId,
            inboxId,
          },
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
    var commit = event.commit;
    var branch = event.branch;
    var html_url = event.html_url;
    var props = {
      repo: '',
      branchHref: '',
      repoHref: '',
    };

    var urlParts = html_url.match(/.+\/(.+)\/projects\/(.+)\/repositories\/(.+)\/.+\/.+/);
    var serverUrl = html_url.match(/(http.?:)\/\/(.*?)\//);

    if (urlParts !== null && serverUrl !== null) {
      var company_name = urlParts[1];
      var project_name = urlParts[2];
      var repo_name = decodeURIComponent(urlParts[3]);
      props.repo = project_name + '/' + repo_name;
      props.repoHref = serverUrl[0] + company_name + '/projects/' + project_name + '/repositories/' + repo_name;
      props.branchHref = props.repoHref + '/tree/' + branch;

    } else {
      throw 'Could not parse DeveoCommitReceived event props correctly.';
    }

    return props;
  },
};

export default deveoTranslator;
