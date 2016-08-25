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

var BitbucketCommitMalformedError = (function (_CSError) {
	_inherits(BitbucketCommitMalformedError, _CSError);

	function BitbucketCommitMalformedError(error, pushEvent) {
		_classCallCheck(this, BitbucketCommitMalformedError);

		_get(Object.getPrototypeOf(BitbucketCommitMalformedError.prototype), 'constructor', this).call(this, ['There was an unexpected error when processing your Bitbucket push event.']);
		this.originalError = error;
		this.pushEvent = pushEvent;
	}

	return BitbucketCommitMalformedError;
})(_csError2['default']);

exports['default'] = BitbucketCommitMalformedError;
module.exports = exports['default'];
