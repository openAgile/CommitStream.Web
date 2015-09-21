'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _helpersCommitsGet = require('../helpers/commitsGet');

var _helpersCommitsGet2 = _interopRequireDefault(_helpersCommitsGet);

var _helpersCacheCreate = require('../helpers/cacheCreate');

var _helpersCacheCreate2 = _interopRequireDefault(_helpersCacheCreate);

var _helpersCommitsChildrenGet = require('../helpers/commitsChildrenGet');

var _helpersCommitsChildrenGet2 = _interopRequireDefault(_helpersCommitsChildrenGet);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var cache = (0, _helpersCacheCreate2['default'])();

exports['default'] = function (req, res) {
  var workitemNumbers = req.query.numbers || '';
  var instanceId = req.instance.instanceId;

  var buildUri = function buildUri(page) {
    return req.href('/api/' + instanceId + '/commits/tags/versionone/workitem?numbers=' + workitemNumbers + '&page=' + page + '&apiKey=' + req.instance.apiKey);
  };

  var workitemNumbersArray = workitemNumbers.split(',');

  if (workitemNumbersArray.length === 1) {
    var stream = 'versionOne_CommitsWithWorkitems-' + instanceId + '_' + workitemNumbers;

    (0, _helpersCommitsGet2['default'])(req.query, stream, buildUri, cache).then(function (commits) {
      // TODO use hal?
      res.send(commits);
    });
  } else {
    (function () {
      var streams = [];
      _underscore2['default'].each(workitemNumbersArray, function (e, i) {
        streams.push('versionOne_CommitsWithWorkitems-' + instanceId + '_' + e);
      });
      (0, _helpersCommitsChildrenGet2['default'])(req.query, streams, buildUri).then(function (commits) {
        res.send(commits);
      });
    })();
  }
};

module.exports = exports['default'];
