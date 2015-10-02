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

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function errorHandler(err, req, res, next) {
  var errorMessage = {
    level: 'error',
    route: req.route.path,
    url: _util2['default'].inspect(req.originalUrl),
    headers: _util2['default'].inspect(req.headers, {
      showHidden: true,
      depth: null
    }),
    body: req.body,
    stackTrace: err.stack,
    exception: _util2['default'].inspect(err, {
      showHidden: true,
      depth: null
    }).substr(0, 5000),
    internalMessage: ''
  };

  function sendError(error) {
    res.status(error.statusCode).json(error.errors);
  }

  if (err instanceof _csError2['default']) {
    sendError(err);
    if (err.internalMessage !== null) {
      errorMessage.internalMessage = err.internalMessage;
    }
    errorMessage.status = err.statusCode;
    _logger2['default'].error(JSON.stringify(errorMessage));
  } else {
    sendError(_csError2['default'].create(500));
    errorMessage.status = 500;
    _logger2['default'].error(JSON.stringify(errorMessage));
  }
}

module.exports = exports['default'];
