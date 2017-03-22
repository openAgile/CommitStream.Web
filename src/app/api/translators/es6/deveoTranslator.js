import util from 'util';
import uuid from 'uuid-v4';
import DeveoCommitMalformedError from '../../middleware/deveoCommitMalformedError';
import getProperties from './getProperties';
import branchNameParse from './branchNameParse';
import VcsFamilies from '../helpers/vcsFamilies';

let deveoTranslator = {
  family: VcsFamilies.Deveo,
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
              email: aCommit.author.email,
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
          eventType: deveoTranslator.family + 'CommitReceived',
          data: commit,
          metadata: {
            instanceId,
            digestId,
            inboxId,
          },
        };
      });
    } catch (ex) {
      throw new DeveoCommitMalformedError(ex, pushEvent);
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
