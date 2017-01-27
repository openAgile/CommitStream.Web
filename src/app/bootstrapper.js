'use strict';

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _eventstoreClient = require('eventstore-client');

var _eventstoreClient2 = _interopRequireDefault(_eventstoreClient);

exports['default'] = {
  boot: function boot(config) {
    var getLocalProjections = function getLocalProjections(cb) {
      var projections = [];
      var dir = _path2['default'].join(__dirname, 'projections');
      _fs2['default'].readdir(dir, function (err, files) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          var _loop = function () {
            var name = _step.value;

            var fullPath = _path2['default'].join(dir, name);
            _fs2['default'].readFile(fullPath, 'utf-8', function (err, script) {
              return cb({ name: name.slice(0, -3), projection: script });
            });
          };

          for (var _iterator = _getIterator(files), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            _loop();
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
              _iterator['return']();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      });
    };

    var initProjections = function initProjections(existingProjections) {
      console.log('Looking for new projections...');
      getLocalProjections(function (item) {
        if (!_underscore2['default'].findWhere(existingProjections.projections, { effectiveName: item.name })) createProjection(item);else console.log('OK found ' + item.name);
      });
    };

    var createProjection = function createProjection(projectionObject) {
      es.projections.post(projectionObject, function (error, response) {
        if (error) {
          console.error('ERROR could not create projection ' + projectionObject.name + ':');
          console.error(error);
        } else {
          console.log('OK created projection ' + projectionObject.name);
          console.log(response.body);
        }
      });
    };

    var es = new _eventstoreClient2['default']({
      baseUrl: config.eventStoreBaseUrl,
      username: config.eventStoreUser,
      password: config.eventStorePassword
    });

    console.log('Enabling system projections...');
    es.projection.enableSystemAll(function () {});

    console.log('Looking for already existing projections...');
    es.projections.get(function (error, response) {
      return initProjections(JSON.parse(response.body));
    });
  }
};
module.exports = exports['default'];
