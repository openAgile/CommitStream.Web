'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _uuidV4 = require('uuid-v4');

var _uuidV42 = _interopRequireDefault(_uuidV4);

var _middlewareDeveoCommitMalformedError = require('../../middleware/deveoCommitMalformedError');

var _middlewareDeveoCommitMalformedError2 = _interopRequireDefault(_middlewareDeveoCommitMalformedError);

var _branchNameParse = require('./branchNameParse');

var _branchNameParse2 = _interopRequireDefault(_branchNameParse);

var _helpersVcsFamilies = require('../helpers/vcsFamilies');

var _helpersVcsFamilies2 = _interopRequireDefault(_helpersVcsFamilies);

var deveoTranslator = {
  family: _helpersVcsFamilies2['default'].Deveo,
  canTranslate: function canTranslate(request) {
    var headers = request.headers;
    return headers.hasOwnProperty('x-deveo-event') && headers['x-deveo-event'] === 'push';
  },
  translatePush: function translatePush(pushEvent, instanceId, digestId, inboxId) {
    try {
      var _ret = (function () {
        var branch = (0, _branchNameParse2['default'])(pushEvent.ref);
        var repository = {
          id: pushEvent.repository.uuid,
          name: pushEvent.repository.name
        };

        return {
          v: pushEvent.commits.map(function (aCommit) {
            var commit = {
              sha: aCommit.id,
              commit: {
                author: pushEvent.repository.type == 'subversion' ? pushEvent.pusher.display_name : aCommit.author.name,
                committer: {
                  name: pushEvent.repository.type == 'subversion' ? pushEvent.pusher.display_name : aCommit.author.name,
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
              eventType: deveoTranslator.family + 'CommitReceived',
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
      throw new _middlewareDeveoCommitMalformedError2['default'](ex, pushEvent);
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

    var urlParts = html_url.match(/.+\/(.+)\/projects\/(.+)\/repositories\/(.+)\/.+\/.+/);
    var serverUrl = html_url.match(/(http.?:)\/\/(.*?)\//);

    if (urlParts !== null && serverUrl !== null) {
      var company_name = urlParts[1];
      var project_name = urlParts[2];
      var repo_name = decodeURIComponent(urlParts[3]);
      props.repo = project_name + '/' + repo_name;
      props.repoHref = serverUrl[0] + company_name + '/projects/' + project_name + '/repositories/' + repo_name;
      props.branchHref = props.repoHref + '/tree/' + branch;
    } else {
      throw 'Could not parse DeveoCommitReceived event props correctly.';
    }

    return props;
  }
};

exports['default'] = deveoTranslator;
module.exports = exports['default'];
