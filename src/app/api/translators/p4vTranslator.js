'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _uuidV4 = require('uuid-v4');

var _uuidV42 = _interopRequireDefault(_uuidV4);

var _middlewareP4vCommitMalformedError = require('../../middleware/p4vCommitMalformedError');

var _middlewareP4vCommitMalformedError2 = _interopRequireDefault(_middlewareP4vCommitMalformedError);

var _helpersVcsFamilies = require('../helpers/vcsFamilies');

var _helpersVcsFamilies2 = _interopRequireDefault(_helpersVcsFamilies);

var hasCorrectHeaders = function hasCorrectHeaders(headers) {
  return headers.hasOwnProperty('cs-p4v-event') && headers['cs-p4v-event'] === 'Commit Event';
};

var p4vTranslator = {
  family: _helpersVcsFamilies2['default'].P4V,
  canTranslate: function canTranslate(request) {
    if (hasCorrectHeaders(request.headers)) {
      return true;
    }
    return false;
  },
  translatePush: function translatePush(commitEvent, instanceId, digestId, inboxId) {
    try {
      //p4v does not have a branch information
      var branch = "";
      //TODO: CHECK WHAT ARE GOING TO SHOW HERE
      var repository = {
        name: commitEvent.repository.substr(commitEvent.repository.lastIndexOf('/') + 1),
        url: commitEvent.repository
      };

      var commit = {
        sha: "r#:" + commitEvent.revision,
        commit: {
          author: {
            'name': commitEvent.author,
            'email': ""
          },
          committer: {
            name: commitEvent.author,
            //p4 does not have email information
            email: "",
            date: commitEvent.committer.date
          },
          message: commitEvent.message
        },
        html_url: commitEvent.html_url,
        repository: repository,
        branch: branch,
        originalMessage: commitEvent
      };
      return [{
        eventId: (0, _uuidV42['default'])(),
        eventType: p4vTranslator.family + 'CommitReceived',
        data: commit,
        metadata: {
          instanceId: instanceId,
          digestId: digestId,
          inboxId: inboxId
        }
      }];
    } catch (ex) {
      throw new _middlewareP4vCommitMalformedError2['default'](ex, commitEvent);
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

exports['default'] = p4vTranslator;
module.exports = exports['default'];
