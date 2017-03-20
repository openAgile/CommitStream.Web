'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _uuidV4 = require('uuid-v4');

var _uuidV42 = _interopRequireDefault(_uuidV4);

var _middlewareGitLabCommitMalformedError = require('../../middleware/gitLabCommitMalformedError');

var _middlewareGitLabCommitMalformedError2 = _interopRequireDefault(_middlewareGitLabCommitMalformedError);

var _getProperties2 = require('./getProperties');

var _getProperties3 = _interopRequireDefault(_getProperties2);

var _branchNameParse = require('./branchNameParse');

var _branchNameParse2 = _interopRequireDefault(_branchNameParse);

var hasCorrectHeaders = function hasCorrectHeaders(headers) {
  return headers.hasOwnProperty('x-gitlab-event') && headers['x-gitlab-event'] === 'Push Hook' && !headers.hasOwnProperty('x-gitswarm-event');
};

var gitLabTranslator = {
  family: 'GitLab',
  canTranslate: function canTranslate(request) {
    // gitLab does not have a pusheEvent.repository.id field, and github does
    // gitLab does not have a commit.committer object, and github does
    if (hasCorrectHeaders(request.headers)) {
      return true;
    }
    return false;
  },
  translatePush: function translatePush(pushEvent, instanceId, digestId, inboxId) {
    try {
      var _ret = (function () {
        var branch = (0, _branchNameParse2['default'])(pushEvent.ref);
        var repository = {
          // gitLab does not have a repository id
          // id: pushEvent.repository.id,
          name: pushEvent.repository.name
        };

        var events = pushEvent.commits.map(function (aCommit) {
          var commit = {
            sha: aCommit.id,
            commit: {
              author: aCommit.author,
              // gitLab does not have a commit.committer object. Using the same thing as author for now.
              committer: {
                name: aCommit.author.name,
                email: aCommit.author.email,
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
            eventType: 'GitLabCommitReceived',
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
      throw new _middlewareGitLabCommitMalformedError2['default'](ex, pushEvent);
    }
  },
  getProperties: function getProperties(event) {
    return (0, _getProperties3['default'])(event, '/commit', 'tree');
  }
};

exports['default'] = gitLabTranslator;
module.exports = exports['default'];
