'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _CsError2 = require('./CsError');

var _CsError3 = _interopRequireDefault(_CsError2);

var MalformedPushEventError = (function (_CsError) {
  _inherits(MalformedPushEventError, _CsError);

  function MalformedPushEventError() {
    var error = arguments.length <= 0 || arguments[0] === undefined ? 'Push event could not be processed.' : arguments[0];

    _classCallCheck(this, MalformedPushEventError);

    _get(Object.getPrototypeOf(MalformedPushEventError.prototype), 'constructor', this).call(this, [error]);
  }

  return MalformedPushEventError;
})(_CsError3['default']);

exports['default'] = MalformedPushEventError;
module.exports = exports['default'];
