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

var InboxHasNotScript = (function (_CsError) {
  _inherits(InboxHasNotScript, _CsError);

  function InboxHasNotScript() {
    var error = arguments.length <= 0 || arguments[0] === undefined ? 'This inbox has not script to retrieve.' : arguments[0];

    _classCallCheck(this, InboxHasNotScript);

    _get(Object.getPrototypeOf(InboxHasNotScript.prototype), 'constructor', this).call(this, [error]);
  }

  return InboxHasNotScript;
})(_CsError3['default']);

exports['default'] = InboxHasNotScript;
module.exports = exports['default'];
