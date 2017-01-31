'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ttlCache = require('ttl-cache');

var _ttlCache2 = _interopRequireDefault(_ttlCache);

exports['default'] = function () {
  var ttl = arguments.length <= 0 || arguments[0] === undefined ? 120 : arguments[0];
  var interval = arguments.length <= 1 || arguments[1] === undefined ? 60 : arguments[1];
  return new _ttlCache2['default']({ ttl: ttl, interval: interval });
};

module.exports = exports['default'];
