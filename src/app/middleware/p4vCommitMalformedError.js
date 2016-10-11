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

var P4vCommitMalformedError = (function (_CsError) {
	_inherits(P4vCommitMalformedError, _CsError);

	function P4vCommitMalformedError(error, pushEvent) {
		_classCallCheck(this, P4vCommitMalformedError);

		_get(Object.getPrototypeOf(P4vCommitMalformedError.prototype), 'constructor', this).call(this, ['There was an unexpected error when processing your P4 Helix commit event.']);
		this.originalError = error;
		this.pushEvent = pushEvent;
	}

	return P4vCommitMalformedError;
})(_csError2['default']);

exports['default'] = P4vCommitMalformedError;
module.exports = exports['default'];
