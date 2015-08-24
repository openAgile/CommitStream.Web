'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _csError = require('./csError');

var _csError2 = _interopRequireDefault(_csError);

var BitbucketCommitMalformedError = _csError2['default'].createCustomError('BitbucketCommitMalformedError', function (error, pushEvent) {
  var message = 'There was an unexpected error when processing your Bitbucket push event.';
  var errors = [message];
  BitbucketCommitMalformedError.prototype.constructor.call(undefined, errors, 400);
});

exports['default'] = BitbucketCommitMalformedError;
module.exports = exports['default'];
