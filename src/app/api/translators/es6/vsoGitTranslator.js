import util from 'util';
import uuid from 'uuid-v4';
import branchNameParse from './branchNameParse';
import _ from 'underscore';
import VsoGitCommitMalformedError from '../../middleware/vsoGitCommitMalformedError';

const vsoGitTranslator = {
  family: 'VsoGit',
  canTranslate(request) {
    return (_.isString(request.body.eventType) && request.body.eventType === 'git.push')
    && (_.isString(request.body.publisherId) && request.body.publisherId === 'tfs')
    && (request.body.resource.commits != undefined);
  },
  translatePush(pushEvent, instanceId, digestId, inboxId) {
    try {
      const branch = branchNameParse(pushEvent.resource.refUpdates[0].name);

      const repository = {
        id: pushEvent.resource.repository.id,
        name: pushEvent.resource.repository.name
      };

      const getHtmlCommitUrl = theCommit => {
        const repositoryName = encodeURIComponent(pushEvent.resource.repository.name);
        // Original format: https://v1platformtest.visualstudio.com/DefaultCollection/_apis/git/repositories/d29767bb-8f5f-4c43-872f-6c73635a1256/commits/e771d9b9d5abab2da4107a0e6db05cef21e40ce8
        // Expected format: https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1 Integration/commit/e771d9b9d5abab2da4107a0e6db05cef21e40ce8
        const url = pushEvent.resource.repository.remoteUrl + '/commit/' + theCommit.commitId;
        return url;
      };

      const events = pushEvent.resource.commits.map(aCommit => {
        const commit = {
          sha: aCommit.commitId,
          commit: {
            author: {
              name: aCommit.author.name,
              email: aCommit.author.email
            },
            committer: {
              name: aCommit.committer.name,
              email: aCommit.committer.email,
              date: aCommit.committer.date
            },
            message: aCommit.comment
          },
          html_url: getHtmlCommitUrl(aCommit),
          repository: repository,
          branch: branch,
          originalMessage: aCommit
        };
        return {
          eventId: uuid(),
          eventType: 'VsoGitCommitReceived',
          data: commit,
          metadata: {
            instanceId: instanceId,
            digestId: digestId,
            inboxId: inboxId
          }
        };
      });
      return events;
    } catch (ex) {
      throw new VsoGitCommitMalformedError(ex, pushEvent);
    }    
  },
  getProperties(event) {
    const commit = event.commit;
    const branch = event.branch;
    const html_url = event.html_url;
    const props = {
      repo: '',
      branchHref: '',
      repoHref: ''
    };

    const urlComponents = html_url.match(/http.?:\/\/..*?_git\/(.*?)\/commit/);
    const serverUrlMatch = html_url.match(/(http.?:)\/\/(.*?_git)\//);

    if (urlComponents !== null && serverUrlMatch !== null) {
      const repoName = urlComponents[2];
      const repoOwner = urlComponents[1];
      const protocol = serverUrlMatch[1];
      const serverUrl = protocol + '//' + serverUrlMatch[2];
      props.repo = `${repoOwner}/${decodeURIComponent(repoName)}`;
      props.repoHref =  serverUrl + '/' + repoName;
      props.branchHref =  props.repoHref + '/#version=GB' + encodeURIComponent(branch);
    } else {
      // TODO: use proper error here
      throw 'Could not parse VsoGitCommitReceived event props correctly.';
    }

    return props;
  }
}

export { vsoGitTranslator as default };