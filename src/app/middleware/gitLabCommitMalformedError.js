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

var GitLabCommitMalformedError = (function (_CsError) {
	_inherits(GitLabCommitMalformedError, _CsError);

	function GitLabCommitMalformedError(error, pushEvent) {
		_classCallCheck(this, GitLabCommitMalformedError);

		_get(Object.getPrototypeOf(GitLabCommitMalformedError.prototype), 'constructor', this).call(this, ['There was an unexpected error when processing your GitLab push event.']);
		this.originalError = error;
		this.pushEvent = pushEvent;
	}

	return GitLabCommitMalformedError;
})(_csError2['default']);

exports['default'] = GitLabCommitMalformedError;
module.exports = exports['default'];
