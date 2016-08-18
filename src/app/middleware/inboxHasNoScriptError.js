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

var InboxHasNoScriptError = (function (_CsError) {
  _inherits(InboxHasNoScriptError, _CsError);

  function InboxHasNoScriptError() {
    _classCallCheck(this, InboxHasNoScriptError);

    _get(Object.getPrototypeOf(InboxHasNoScriptError.prototype), 'constructor', this).call(this, ['This inbox has no script to retrieve.']);
  }

  return InboxHasNoScriptError;
})(_CsError3['default']);

exports['default'] = InboxHasNoScriptError;
module.exports = exports['default'];
