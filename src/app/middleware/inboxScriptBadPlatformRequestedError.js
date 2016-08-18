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

var InboxScriptBadPlatformRequestedError = (function (_CsError) {
	_inherits(InboxScriptBadPlatformRequestedError, _CsError);

	function InboxScriptBadPlatformRequestedError() {
		_classCallCheck(this, InboxScriptBadPlatformRequestedError);

		_get(Object.getPrototypeOf(InboxScriptBadPlatformRequestedError.prototype), 'constructor', this).call(this, ['There was expecting Linux or Windows as platform query parameter']);
	}

	return InboxScriptBadPlatformRequestedError;
})(_CsError3['default']);

exports['default'] = InboxScriptBadPlatformRequestedError;
module.exports = exports['default'];
