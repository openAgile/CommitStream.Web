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

var CtfSvnCommitMalformedError = (function (_CSError) {
  _inherits(CtfSvnCommitMalformedError, _CSError);

  function CtfSvnCommitMalformedError(error, pushEvent) {
    _classCallCheck(this, CtfSvnCommitMalformedError);

    _get(Object.getPrototypeOf(CtfSvnCommitMalformedError.prototype), 'constructor', this).call(this, ['There was an unexpected error when processing your CollabNet TeamForge Subversion commit event.']);
    this.originalError = error;
    this.pushEvent = pushEvent;
  }

  return CtfSvnCommitMalformedError;
})(_csError2['default']);

exports['default'] = CtfSvnCommitMalformedError;
module.exports = exports['default'];
