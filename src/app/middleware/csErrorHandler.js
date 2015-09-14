'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = errorHandler;

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _csError = require('./csError');

var _csError2 = _interopRequireDefault(_csError);

function errorHandler(err, req, res, next) {
  console.error("\nEXCEPTION RAISED BY API ROUTE: " + _util2['default'].inspect(req.route, {
    showHidden: true,
    depth: null
  }).substr(0, 5000));
  console.error("STACK TRACE:");
  console.error(err.stack);
  console.error("CAUGHT ERROR DETAILS:");
  console.error(_util2['default'].inspect(err, {
    showHidden: true,
    depth: null
  }).substr(0, 5000));

  function sendError(error) {
    res.status(error.statusCode).json(error.errors);
  }

  if (err instanceof _csError2['default']) {
    sendError(err);
    if (err.internalMessage !== null) {
      console.error("INTERNAL MESSAGE:");
      console.error(err.internalMessage);
    }
  } else {
    sendError(_csError2['default'].create(500));
  }
}

module.exports = exports['default'];
