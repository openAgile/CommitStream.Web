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

var DeveoCommitMalformedError = (function (_CSError) {
  _inherits(DeveoCommitMalformedError, _CSError);

  function DeveoCommitMalformedError(error, pushEvent) {
    _classCallCheck(this, DeveoCommitMalformedError);

    _get(Object.getPrototypeOf(DeveoCommitMalformedError.prototype), 'constructor', this).call(this, ['There was an unexpected error when processing your Deveo push event.']);
    this.originalError = error;
    this.pushEvent = pushEvent;
  }

  return DeveoCommitMalformedError;
})(_csError2['default']);

exports['default'] = DeveoCommitMalformedError;
module.exports = exports['default'];
