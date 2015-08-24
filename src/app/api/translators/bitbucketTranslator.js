'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _uuidV4 = require('uuid-v4');

var _uuidV42 = _interopRequireDefault(_uuidV4);

var _middlewareBitbucketCommitMalformedError = require('../../middleware/bitbucketCommitMalformedError');

var _middlewareBitbucketCommitMalformedError2 = _interopRequireDefault(_middlewareBitbucketCommitMalformedError);

var bitbucketTranslator = {};

var hasCorrectHeaders = function hasCorrectHeaders(headers) {
  return headers.hasOwnProperty('x-event-key') && headers['x-event-key'] === 'repo:push';
};

bitbucketTranslator.canTranslate = function (request) {
  return hasCorrectHeaders(request.headers);
};

bitbucketTranslator.translatePush = function (pushEvent, instanceId, digestId, inboxId) {
  try {
    var _ret = (function () {
      var branch = pushEvent.push.changes[0]['new'].name;
      var repository = {
        id: pushEvent.repository.uuid,
        name: pushEvent.repository.name
      };
      var events = _underscore2['default'].map(pushEvent.push.changes[0].commits, function (aCommit) {
        var commit = {
          sha: aCommit.hash,
          commit: {
            author: aCommit.author.user.username,
            // bitbucket does not have a commit.committer object. Using the same thing as author for now.
            committer: {
              name: aCommit.author.user.display_name,
              email: aCommit.author.raw,
              date: ''
            },
            message: aCommit.message
          },
          html_url: aCommit.links.html.href,
          repository: repository,
          branch: branch,
          originalMessage: aCommit
        };
        return {
          eventId: (0, _uuidV42['default'])(),
          eventType: 'BitbucketCommitReceived',
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
    throw new _middlewareBitbucketCommitMalformedError2['default'](ex, pushEvent);
  }
};

exports['default'] = bitbucketTranslator;
module.exports = exports['default'];
