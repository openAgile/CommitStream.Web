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

var InboxScriptRetrievedErro = (function (_CsError) {
	_inherits(InboxScriptRetrievedErro, _CsError);

	function InboxScriptRetrievedErro() {
		_classCallCheck(this, InboxScriptRetrievedErro);

		_get(Object.getPrototypeOf(InboxScriptRetrievedErro.prototype), 'constructor', this).call(this, ['There was an unexpected error when retrieving your Svn script.']);
	}

	return InboxScriptRetrievedErro;
})(_CsError3['default']);

exports['default'] = InboxScriptRetrievedErro;
module.exports = exports['default'];
