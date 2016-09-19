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

var VsoGitCommitMalformedError = (function (_CSError) {
    _inherits(VsoGitCommitMalformedError, _CSError);

    function VsoGitCommitMalformedError(error, pushEvent) {
        _classCallCheck(this, VsoGitCommitMalformedError);

        _get(Object.getPrototypeOf(VsoGitCommitMalformedError.prototype), 'constructor', this).call(this, ['There was an unexpected error when processing your Visual Studio Online Git push event.']);
        this.originalError = error;
        this.pushEvent = pushEvent;
    }

    return VsoGitCommitMalformedError;
})(_csError2['default']);

exports['default'] = VsoGitCommitMalformedError;
module.exports = exports['default'];
