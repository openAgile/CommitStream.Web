'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _uuidV4 = require('uuid-v4');

var _uuidV42 = _interopRequireDefault(_uuidV4);

var _middlewareSvnCommitMalformedError = require('../../middleware/svnCommitMalformedError');

var _middlewareSvnCommitMalformedError2 = _interopRequireDefault(_middlewareSvnCommitMalformedError);

var hasCorrectHeaders = function hasCorrectHeaders(headers) {
  return headers.hasOwnProperty('cs-svn-event') && headers['cs-svn-event'] === 'Commit Event';
};

var svnTranslator = {
  family: 'Svn',
  canTranslate: function canTranslate(request) {
    if (hasCorrectHeaders(request.headers)) {
      return true;
    }
    return false;
  },
  translatePush: function translatePush(commitEvent, instanceId, digestId, inboxId) {
    try {
      //svn does not have a branch information
      var branch = "";
      var revisionNumber = commitEvent.pretext.split("rev. ");
      var repository = {
        // gitLab does not have a repository id
        // id: pushEvent.repository.id,
        name: commitEvent.repository.substr(commitEvent.repository.lastIndexOf('/') + 1),
        url: commitEvent.repository
      };

      var commit = {
        //svn it doesn't contains a commit id so we can use the revision number
        sha: "r" + revisionNumber[revisionNumber.length - 1],
        commit: {
          author: {
            'name': commitEvent.author,
            'email': ""
          },
          committer: {
            name: commitEvent.author,
            //svn does not have email information
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
        eventType: svnTranslator.family + 'CommitReceived',
        data: commit,
        metadata: {
          instanceId: instanceId,
          digestId: digestId,
          inboxId: inboxId
        }
      }];
    } catch (ex) {
      throw new _middlewareSvnCommitMalformedError2['default'](ex, commitEvent);
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

exports['default'] = svnTranslator;
module.exports = exports['default'];
