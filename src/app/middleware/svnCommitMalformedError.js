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

var SvnCommitMalformedError = (function (_CsError) {
	_inherits(SvnCommitMalformedError, _CsError);

	function SvnCommitMalformedError(error, pushEvent) {
		_classCallCheck(this, SvnCommitMalformedError);

		_get(Object.getPrototypeOf(SvnCommitMalformedError.prototype), 'constructor', this).call(this, ['There was an unexpected error when processing your Svn commit event.']);
		this.originalError = error;
		this.pushEvent = pushEvent;
	}

	return SvnCommitMalformedError;
})(_csError2['default']);

exports['default'] = SvnCommitMalformedError;
module.exports = exports['default'];
