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

var InboxScriptBadPlatformRequestedError = (function (_CsError) {
	_inherits(InboxScriptBadPlatformRequestedError, _CsError);

	function InboxScriptBadPlatformRequestedError() {
		_classCallCheck(this, InboxScriptBadPlatformRequestedError);

		_get(Object.getPrototypeOf(InboxScriptBadPlatformRequestedError.prototype), 'constructor', this).call(this, ['Expected linux or windows as platform query parameter']);
	}

	return InboxScriptBadPlatformRequestedError;
})(_csError2['default']);

exports['default'] = InboxScriptBadPlatformRequestedError;
module.exports = exports['default'];
