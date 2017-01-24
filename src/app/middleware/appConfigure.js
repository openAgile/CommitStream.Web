'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _resHref = require('./resHref');

var _resHref2 = _interopRequireDefault(_resHref);

var _resHal = require('./resHal');

var _resHal2 = _interopRequireDefault(_resHal);

exports['default'] = function (app) {
  return app.use(_resHref2['default']).use(_resHal2['default']);
};

module.exports = exports['default'];
