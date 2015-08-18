'use strict';

(function (bitbucketTranslator) {
  var _ = require('underscore'),
      uuid = require('uuid-v4');

  var hasCorrectHeaders = function hasCorrectHeaders(headers) {
    //X-Event-Key: repo:push
    return headers.hasOwnProperty('User-Agent') && headers['User-Agent'] === 'Bitbucket-Webhooks/2.0';
  };

  bitbucketTranslator.canTranslate = function (request) {
    if (hasCorrectHeaders(request.headers)) {
      return true;
    }
    return false;
  };
})(module.exports);
