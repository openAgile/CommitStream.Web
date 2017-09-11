'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _uuidV4 = require('uuid-v4');

var _uuidV42 = _interopRequireDefault(_uuidV4);

var _middlewareCtfGitCommitMalformedError = require('../../middleware/ctfGitCommitMalformedError');

var _middlewareCtfGitCommitMalformedError3 = _interopRequireDefault(_middlewareCtfGitCommitMalformedError);

var _branchNameParse = require('./branchNameParse');

var _branchNameParse2 = _interopRequireDefault(_branchNameParse);

var _helpersVcsFamilies = require('../helpers/vcsFamilies');

var _helpersVcsFamilies2 = _interopRequireDefault(_helpersVcsFamilies);

var ctfGitTranslator = {
  family: _helpersVcsFamilies2['default'].CtfGit,
  canTranslate: function canTranslate(request) {
    if (hasCorrectHeaders(request.headers)) {
      return true;
    }
    return false;
  },
  translatePush: function translatePush(ctfEvent, instanceId, digestId, inboxId) {
    try {
      var _ret = (function () {
        var branch = (0, _branchNameParse2['default'])(ctfEvent.ref);
        var repository = {
          id: ctfEvent.repository.id,
          name: ctfEvent.repository.name,
          url: ctfEvent.repository.url
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
              eventType: ctfGitTranslator.family + 'CommitReceived',
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
      throw new _middlewareCtfGitCommitMalformedError2['default'](ex, ctfEvent);
    }
  },
  getProperties: function getProperties(event) {
    var props = {
      repo: event.repository.name,
      repoHref: event.repository.url,
      branchHref: ''
    };
    return props;
  }
};

var hasCorrectHeaders = function hasCorrectHeaders(headers) {
  return headers.hasOwnProperty('x-ctf-scm') && headers['x-ctf-scm'] === 'git';
};

exports['default'] = ctfGitTranslator;
module.exports = exports['default'];
