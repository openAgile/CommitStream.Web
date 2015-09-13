'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _csError = require('./csError');

var _csError2 = _interopRequireDefault(_csError);

var UnsupportedMediaType = (function (_CSError) {
  _inherits(UnsupportedMediaType, _CSError);

  function UnsupportedMediaType() {
    var message = arguments.length <= 0 || arguments[0] === undefined ? 'The Content-Type header is unspecified or invalid' : arguments[0];

    _classCallCheck(this, UnsupportedMediaType);

    var errors = [message];
    _get(Object.getPrototypeOf(UnsupportedMediaType.prototype), 'constructor', this).call(this, errors, 415);
  }

  return UnsupportedMediaType;
})(_csError2['default']);

exports['default'] = function (req, res, next) {
  if (req.method !== 'POST') return next();
  if (!req.is('application/json')) {
    throw new UnsupportedMediaType('When issuing a POST to the CommitStream API, you must send a Content-Type: application/json header.');
  } else {
    return next();
  }
};

;
module.exports = exports['default'];
