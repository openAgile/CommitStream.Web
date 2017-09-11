'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _uuidV4 = require('uuid-v4');

var _uuidV42 = _interopRequireDefault(_uuidV4);

var _middlewareCtfSvnCommitMalformedError = require('../../middleware/ctfSvnCommitMalformedError');

var _middlewareCtfSvnCommitMalformedError2 = _interopRequireDefault(_middlewareCtfSvnCommitMalformedError);

var _helpersVcsFamilies = require('../helpers/vcsFamilies');

var _helpersVcsFamilies2 = _interopRequireDefault(_helpersVcsFamilies);

var ctfSvnTranslator = {
  family: _helpersVcsFamilies2['default'].CtfSvn,
  canTranslate: function canTranslate(request) {
    if (hasCorrectHeaders(request.headers)) {
      return true;
    }
    return false;
  },
  translatePush: function translatePush(ctfEvent, instanceId, digestId, inboxId) {
    try {
      // svn does not have a branch information
      var branch = '';
      var repository = {
        id: ctfEvent.repository.id,
        name: ctfEvent.repository.name,
        url: ctfEvent.repository.url
      };
      var revision = ctfEvent.revision;
      var commit = {
        // svn doesn't contains a commit id so we can use the revision number
        sha: 'r' + revision.id,
        commit: {
          author: {
            'name': revision.author.name,
            'email': revision.author.email
          },
          committer: {
            name: revision.author.name,
            email: revision.author.email,
            date: revision.timestamp
          },
          message: revision.message
        },
        html_url: revision.url,
        repository: repository,
        branch: branch,
        originalMessage: ctfEvent
      };
      return [{
        eventId: (0, _uuidV42['default'])(),
        eventType: ctfSvnTranslator.family + 'CommitReceived',
        data: commit,
        metadata: {
          instanceId: instanceId,
          digestId: digestId,
          inboxId: inboxId
        }
      }];
    } catch (ex) {
      throw new _middlewareCtfSvnCommitMalformedError2['default'](ex, ctfEvent);
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
  return headers.hasOwnProperty('x-ctf-scm') && headers['x-ctf-scm'] === 'subversion';
};

exports['default'] = ctfSvnTranslator;
module.exports = exports['default'];
