'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _uuidV4 = require('uuid-v4');

var _uuidV42 = _interopRequireDefault(_uuidV4);

var _branchNameParse = require('./branchNameParse');

var _branchNameParse2 = _interopRequireDefault(_branchNameParse);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _middlewareVsoGitCommitMalformedError = require('../../middleware/vsoGitCommitMalformedError');

var _middlewareVsoGitCommitMalformedError2 = _interopRequireDefault(_middlewareVsoGitCommitMalformedError);

var _helpersVcsFamilies = require('../helpers/vcsFamilies');

var _helpersVcsFamilies2 = _interopRequireDefault(_helpersVcsFamilies);

var vsoGitPullRequestTranslator = {
  family: _helpersVcsFamilies2['default'].VsoGit,
  canTranslate: function canTranslate(request) {
    console.log("#########################################");
    console.log(request.body.eventType);
    console.log(request.body.publisherId);
    console.log(request.body.eventType === 'git.pullrequest.created');
    console.log(request.body.publisherId === 'tfs');
    return _underscore2['default'].isString(request.body.eventType) && request.body.eventType === 'git.pullrequest.created' && _underscore2['default'].isString(request.body.publisherId) && request.body.publisherId === 'tfs';
  },
  translatePush: function translatePush(pushEvent, instanceId, digestId, inboxId) {
    try {

      var pullRequest = {
        sha: pushEvent.id,
        message: pushEvent.detailedMessage,
        author: {
          name: pushEvent.resource.createdBy.displayName,
          email: pushEvent.resource.createdBy.uniqueName
        },
        html_url: pushEvent.resource._links.web.href
      };

      return [{
        eventId: (0, _uuidV42['default'])(),
        eventType: vsoGitPullRequestTranslator.family + 'PullRequestReceived',
        data: pullRequest,
        metadata: {
          instanceId: instanceId,
          digestId: digestId,
          inboxId: inboxId
        }
      }];

      // const branch = branchNameParse(pushEvent.resource.refUpdates[0].name);
      //
      // const repository = {
      //   id: pushEvent.resource.repository.id,
      //   name: pushEvent.resource.repository.name
      // };
      //
      // const getHtmlCommitUrl = theCommit => {
      //   const repositoryName = encodeURIComponent(pushEvent.resource.repository.name);
      //   // Original format: https://v1platformtest.visualstudio.com/DefaultCollection/_apis/git/repositories/d29767bb-8f5f-4c43-872f-6c73635a1256/commits/e771d9b9d5abab2da4107a0e6db05cef21e40ce8
      //   // Expected format: https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1 Integration/commit/e771d9b9d5abab2da4107a0e6db05cef21e40ce8
      //   const url = pushEvent.resource.repository.remoteUrl + '/commit/' + theCommit.commitId;
      //   return url;
      // };
      //
      // const events = pushEvent.resource.commits.map(aCommit => {
      //   const commit = {
      //     sha: aCommit.commitId,
      //     commit: {
      //       author: {
      //         name: aCommit.author.name,
      //         email: aCommit.author.email
      //       },
      //       committer: {
      //         name: aCommit.committer.name,
      //         email: aCommit.committer.email,
      //         date: aCommit.committer.date
      //       },
      //       message: aCommit.comment
      //     },
      //     html_url: getHtmlCommitUrl(aCommit),
      //     repository: repository,
      //     branch: branch,
      //     originalMessage: aCommit
      //   };
      //   return {
      //     eventId: uuid(),
      //     eventType: vsoGitPullRequestTranslator.family + 'PullRequestReceived',
      //     data: commit,
      //     metadata: {
      //       instanceId: instanceId,
      //       digestId: digestId,
      //       inboxId: inboxId
      //     }
      //   };
      // });
      // return events;
    } catch (ex) {
      throw new _middlewareVsoGitCommitMalformedError2['default'](ex, pushEvent);
    }
  }
};

exports['default'] = vsoGitPullRequestTranslator;
module.exports = exports['default'];
