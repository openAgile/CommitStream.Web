'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _uuidV4 = require('uuid-v4');

var _uuidV42 = _interopRequireDefault(_uuidV4);

var _getProperties2 = require('./getProperties');

var _getProperties3 = _interopRequireDefault(_getProperties2);

var _middlewareGitHubCommitMalformedError = require('../../middleware/gitHubCommitMalformedError');

var _middlewareGitHubCommitMalformedError2 = _interopRequireDefault(_middlewareGitHubCommitMalformedError);

var _branchNameParse = require('./branchNameParse');

var _branchNameParse2 = _interopRequireDefault(_branchNameParse);

var _helpersVcsFamilies = require('../helpers/vcsFamilies');

var _helpersVcsFamilies2 = _interopRequireDefault(_helpersVcsFamilies);

var githubTranslator = {
  family: _helpersVcsFamilies2['default'].GitHub,
  translatePush: function translatePush(pushEvent, instanceId, digestId, inboxId) {
    try {
      var _ret = (function () {
        var branch = (0, _branchNameParse2['default'])(pushEvent.ref);
        var repository = {
          id: pushEvent.repository.id,
          name: pushEvent.repository.name
        };

        return {
          v: pushEvent.commits.map(function (aCommit) {
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
              repository: repository,
              branch: branch,
              originalMessage: aCommit
            };
            return {
              eventId: (0, _uuidV42['default'])(),
              eventType: githubTranslator.family + 'CommitReceived',
              data: commit,
              metadata: {
                instanceId: instanceId,
                digestId: digestId,
                inboxId: inboxId
              }
            };
          })
        };
      })();

      if (typeof _ret === 'object') return _ret.v;
    } catch (ex) {
      throw new _middlewareGitHubCommitMalformedError2['default'](ex, pushEvent);
    }
  },
  canTranslate: function canTranslate(request) {
    var headers = request.headers;
    return headers.hasOwnProperty('x-github-event') && headers['x-github-event'] === 'push';
  },
  getProperties: function getProperties(event) {
    return (0, _getProperties3['default'])(event, '/commit', 'tree');
  }
};

exports['default'] = githubTranslator;
module.exports = exports['default'];
