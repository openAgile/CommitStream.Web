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

var CtfGitCommitMalformedError = (function (_CSError) {
  _inherits(CtfGitCommitMalformedError, _CSError);

  function CtfGitCommitMalformedError(error, pushEvent) {
    _classCallCheck(this, CtfGitCommitMalformedError);

    _get(Object.getPrototypeOf(CtfGitCommitMalformedError.prototype), 'constructor', this).call(this, ['There was an unexpected error when processing your CollabNet TeamForge Git commit event.']);
    this.originalError = error;
    this.pushEvent = pushEvent;
  }

  return CtfGitCommitMalformedError;
})(_csError2['default']);

exports['default'] = CtfGitCommitMalformedError;
module.exports = exports['default'];
