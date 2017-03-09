'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _healthStatusGet = require('./healthStatusGet');

var _healthStatusGet2 = _interopRequireDefault(_healthStatusGet);

var _healthProjectionsGet = require('./healthProjectionsGet');

var _healthProjectionsGet2 = _interopRequireDefault(_healthProjectionsGet);

exports['default'] = {
  init: function init(app) {
    app.get('/health/status', _healthStatusGet2['default']);
    app.get('/health/projections', _healthProjectionsGet2['default']);
  }
};
module.exports = exports['default'];
