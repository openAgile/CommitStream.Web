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

var MalformedPushEventError = (function (_CsError) {
  _inherits(MalformedPushEventError, _CsError);

  function MalformedPushEventError() {
    var error = arguments.length <= 0 || arguments[0] === undefined ? 'Push event could not be processed.' : arguments[0];

    _classCallCheck(this, MalformedPushEventError);

    _get(Object.getPrototypeOf(MalformedPushEventError.prototype), 'constructor', this).call(this, [error]);
  }

  return MalformedPushEventError;
})(_csError2['default']);

exports['default'] = MalformedPushEventError;
module.exports = exports['default'];
