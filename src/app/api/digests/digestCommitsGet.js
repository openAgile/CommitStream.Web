'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _this = this;

var _helpersCommitsGet = require('../helpers/commitsGet');

var _helpersCommitsGet2 = _interopRequireDefault(_helpersCommitsGet);

var _helpersCacheCreate = require('../helpers/cacheCreate');

var _helpersCacheCreate2 = _interopRequireDefault(_helpersCacheCreate);

var cache = (0, _helpersCacheCreate2['default'])();

exports['default'] = function callee$0$0(req, res) {
  var digestId, instanceId, buildUri, stream, commits;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        digestId = req.params.digestId;
        instanceId = req.instance.instanceId;

        buildUri = function buildUri(page) {
          return req.href('/api/' + instanceId + '/digests/' + digestId + '/commits?page=' + page + '&apiKey=' + req.instance.apiKey);
        };

        stream = 'digestCommits-' + digestId;
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap((0, _helpersCommitsGet2['default'])(req.query, stream, buildUri, cache));

      case 6:
        commits = context$1$0.sent;

        res.send(commits);

      case 8:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this);
};

module.exports = exports['default'];
