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

var SvnCommitMalformedError = (function (_CsError) {
	_inherits(SvnCommitMalformedError, _CsError);

	function SvnCommitMalformedError() {
		_classCallCheck(this, SvnCommitMalformedError);

		_get(Object.getPrototypeOf(SvnCommitMalformedError.prototype), 'constructor', this).call(this, ['There was an unexpected error when processing your Svn commit event.']);
	}

	return SvnCommitMalformedError;
})(_CsError3['default']);

exports['default'] = SvnCommitMalformedError;
module.exports = exports['default'];
