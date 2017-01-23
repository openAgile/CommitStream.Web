'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var makeHref = function makeHref(req) {
  var protocol = _config2['default'].protocol || req.protocol;
  var host = req.get('host');
  return function (path) {
    return protocol + '://' + host + path;
  };
};

exports['default'] = function (req, res, next) {
  req.href = makeHref(req);
  if (next) return next();
};

module.exports = exports['default'];
