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

var isVsoRequest = function isVsoRequest(request) {
  return _underscore2['default'].isString(request.body.eventType) && request.body.eventType === 'git.push' && _underscore2['default'].isString(request.body.publisherId) && request.body.publisherId === 'tfs';
};

var hasCommits = function hasCommits(request) {
  return _underscore2['default'].isObject(request.body.resource) && _underscore2['default'].isArray(request.body.resource.commits);
};

var vsoGitTranslator = {
  family: _helpersVcsFamilies2['default'].VsoGit,
  canTranslate: function canTranslate(request) {
    return isVsoRequest(request) && hasCommits(request);
  },
  translatePush: function translatePush(pushEvent, instanceId, digestId, inboxId) {
    try {
      var _ret = (function () {
        var branch = (0, _branchNameParse2['default'])(pushEvent.resource.refUpdates[0].name);

        var repository = {
          id: pushEvent.resource.repository.id,
          name: pushEvent.resource.repository.name
        };

        var getHtmlCommitUrl = function getHtmlCommitUrl(theCommit) {
          var repositoryName = encodeURIComponent(pushEvent.resource.repository.name);
          // Original format: https://v1platformtest.visualstudio.com/DefaultCollection/_apis/git/repositories/d29767bb-8f5f-4c43-872f-6c73635a1256/commits/e771d9b9d5abab2da4107a0e6db05cef21e40ce8
          // Expected format: https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1 Integration/commit/e771d9b9d5abab2da4107a0e6db05cef21e40ce8
          var url = pushEvent.resource.repository.remoteUrl + '/commit/' + theCommit.commitId;
          return url;
        };

        var events = pushEvent.resource.commits.map(function (aCommit) {
          var commit = {
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
            eventId: (0, _uuidV42['default'])(),
            eventType: vsoGitTranslator.family + 'CommitReceived',
            data: commit,
            metadata: {
              instanceId: instanceId,
              digestId: digestId,
              inboxId: inboxId
            }
          };
        });
        return {
          v: events
        };
      })();

      if (typeof _ret === 'object') return _ret.v;
    } catch (ex) {
      throw new _middlewareVsoGitCommitMalformedError2['default'](ex, pushEvent);
    }
  },
  getProperties: function getProperties(event) {
    var commit = event.commit;
    var branch = event.branch;
    var html_url = event.html_url;
    var props = {
      repo: '',
      branchHref: '',
      repoHref: ''
    };

    var urlComponents = html_url.match(/https?:\/\/(.+?)[\:\.\/].+_git\/(.+)\/commit/);
    var serverUrlMatch = html_url.match(/(http.?:)\/\/(.*?_git)\//);
    if (urlComponents !== null && serverUrlMatch !== null) {
      var repoName = urlComponents[2];
      var repoOwner = urlComponents[1];
      var protocol = serverUrlMatch[1];
      var serverUrl = protocol + '//' + serverUrlMatch[2];
      props.repo = repoOwner + '/' + decodeURIComponent(repoName);
      props.repoHref = serverUrl + '/' + repoName;
      props.branchHref = props.repoHref + '/#version=GB' + encodeURIComponent(branch);
    } else {
      throw 'Could not parse VsoGitCommitReceived event props correctly.';
    }

    return props;
  }
};

exports['default'] = vsoGitTranslator;
module.exports = exports['default'];
