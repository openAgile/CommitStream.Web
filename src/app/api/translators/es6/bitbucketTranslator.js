((bitbucketTranslator) => {
  let _ = require('underscore'),
    uuid = require('uuid-v4');

  let hasCorrectHeaders = (headers) => {
    //X-Event-Key: repo:push
    return headers.hasOwnProperty('User-Agent') && headers['User-Agent'] === 'Bitbucket-Webhooks/2.0';
  }

  bitbucketTranslator.canTranslate = (request) => {
    if (hasCorrectHeaders(request.headers)) {
      return true;
    }
    return false;
  }

})(module.exports);
