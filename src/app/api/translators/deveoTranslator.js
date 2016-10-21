'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _uuidV4 = require('uuid-v4');

var _uuidV42 = _interopRequireDefault(_uuidV4);

var _middlewareCsError = require('../../middleware/csError');

var _middlewareCsError2 = _interopRequireDefault(_middlewareCsError);

var _getProperties2 = require('./getProperties');

var _getProperties3 = _interopRequireDefault(_getProperties2);

var _branchNameParse = require('./branchNameParse');

var _branchNameParse2 = _interopRequireDefault(_branchNameParse);

//TODO: do we want this kind of library to know about status codes?

var DeveoCommitMalformedError = (function (_CSError) {
  _inherits(DeveoCommitMalformedError, _CSError);

  function DeveoCommitMalformedError(error, pushEvent) {
    _classCallCheck(this, DeveoCommitMalformedError);

    _get(Object.getPrototypeOf(DeveoCommitMalformedError.prototype), 'constructor', this).call(this, ['There was an unexpected error when processing your Deveo push event.']);
    this.originalError = error;
    this.pushEvent = pushEvent;
  }

  return DeveoCommitMalformedError;
})(_middlewareCsError2['default']);

var deveoTranslator = {
  family: 'Deveo',
  translatePush: function translatePush(pushEvent, instanceId, digestId, inboxId) {
    try {
      var _ret = (function () {
        var branch = (0, _branchNameParse2['default'])(pushEvent.ref);
        var repository = {
          id: pushEvent.repository.uuid,
          name: pushEvent.project.name + '/' + pushEvent.repository.name
        };

        return {
          v: pushEvent.commits.map(function (aCommit) {
            var commit = {
              sha: aCommit.id,
              commit: {
                author: aCommit.author.name,
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
              eventType: 'DeveoCommitReceived',
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
      var otherEx = new DeveoCommitMalformedError(ex, pushEvent);
      //console.log(otherEx, otherEx.originalError.stack);
      throw otherEx;
    }
  },
  canTranslate: function canTranslate(request) {
    var headers = request.headers;
    return headers.hasOwnProperty('x-deveo-event') && headers['x-deveo-event'] === 'push';
  },
  getProperties: function getProperties(event) {
    var props = {
      repo: event.project.name + '/' + event.repository.name,
      branchHref: event.project.url + '/repositories/' + event.repository.name + '/' + branch,
      repoHref: event.project.url + '/repositories/' + event.repository.name
    };

    return props;
  }
};

exports['default'] = deveoTranslator;
module.exports = exports['default'];
