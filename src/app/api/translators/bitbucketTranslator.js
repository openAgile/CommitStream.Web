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

var _getProperties2 = require('./getProperties');

var _getProperties3 = _interopRequireDefault(_getProperties2);

var _helpersVcsFamilies = require('../helpers/vcsFamilies');

var _helpersVcsFamilies2 = _interopRequireDefault(_helpersVcsFamilies);

var bitbucketTranslator = {
  family: _helpersVcsFamilies2['default'].Bitbucket,
  hasCorrectHeaders: function hasCorrectHeaders(headers) {
    return headers.hasOwnProperty('x-event-key') && headers['x-event-key'] === 'repo:push';
  },
  canTranslate: function canTranslate(request) {
    return this.hasCorrectHeaders(request.headers);
  },
  translatePush: function translatePush(pushEvent, instanceId, digestId, inboxId) {
    try {
      var _ret = (function () {
        var latestCommit = pushEvent.push.changes[0]['new'];
        //TODO: we only have the date of the newest commit in the push.
        //Do we want to use it for every commit?

        var branch = latestCommit.name;
        var date = latestCommit.target.date;
        var repository = {
          id: pushEvent.repository.uuid,
          name: pushEvent.repository.name
        };
        // Bitbucket puts the newest commits firts hence the reverse
        var commits = pushEvent.push.changes[0].commits.reverse();
        var events = _underscore2['default'].map(commits, function (aCommit) {
          var author = aCommit.author;
          var email = author.raw;
          var display_name = undefined,
              username = undefined;
          if (_underscore2['default'].has(author, 'user') && _underscore2['default'].has(author.user, 'display_name')) display_name = author.user.display_name;else display_name = 'unknown';
          if (_underscore2['default'].has(author, 'user') && _underscore2['default'].has(author.user, 'username')) username = author.user.username;else username = 'unknown';
          var commit = {
            sha: aCommit.hash,
            commit: {
              author: username,
              // bitbucket does not have a commit.committer object. Using the same thing as author for now.
              committer: {
                name: display_name,
                email: email,
                date: date
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
            eventType: bitbucketTranslator.family + 'CommitReceived',
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
  },
  getProperties: function getProperties(event) {
    return (0, _getProperties3['default'])(event, '/commits', 'branch');
  }
};

exports['default'] = bitbucketTranslator;
module.exports = exports['default'];
