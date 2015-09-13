'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _CsError = require('./CsError');

var _CsError2 = _interopRequireDefault(_CsError);

var BitbucketCommitMalformedError = (function (_CSError) {
	_inherits(BitbucketCommitMalformedError, _CSError);

	function BitbucketCommitMalformedError(error, pushEvent) {
		_classCallCheck(this, BitbucketCommitMalformedError);

		var message = 'There was an unexpected error when processing your Bitbucket push event.';
		var errors = [message];
		_get(Object.getPrototypeOf(BitbucketCommitMalformedError.prototype), 'constructor', this).call(this, errors);
	}

	return BitbucketCommitMalformedError;
})(CSError);

exports['default'] = BitbucketCommitMalformedError;
module.exports = exports['default'];
