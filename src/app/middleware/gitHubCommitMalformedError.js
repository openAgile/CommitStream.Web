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

var GitHubCommitMalformedError = (function (_CSError) {
    _inherits(GitHubCommitMalformedError, _CSError);

    function GitHubCommitMalformedError(error, pushEvent) {
        _classCallCheck(this, GitHubCommitMalformedError);

        _get(Object.getPrototypeOf(GitHubCommitMalformedError.prototype), 'constructor', this).call(this, ['There was an unexpected error when processing your GitHub push event.']);
        this.originalError = error;
        this.pushEvent = pushEvent;
    }

    return GitHubCommitMalformedError;
})(_csError2['default']);

exports['default'] = GitHubCommitMalformedError;
module.exports = exports['default'];
