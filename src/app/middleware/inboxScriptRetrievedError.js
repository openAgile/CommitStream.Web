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

var InboxScriptRetrievedError = (function (_CsError) {
	_inherits(InboxScriptRetrievedError, _CsError);

	function InboxScriptRetrievedError() {
		_classCallCheck(this, InboxScriptRetrievedError);

		_get(Object.getPrototypeOf(InboxScriptRetrievedError.prototype), 'constructor', this).call(this, ['There was an unexpected error when retrieving your Svn script.']);
	}

	return InboxScriptRetrievedError;
})(_csError2['default']);

exports['default'] = InboxScriptRetrievedError;
module.exports = exports['default'];
