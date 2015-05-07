(function() {
  var csError = require('../../middleware/csError');

  var CommitsTranslatorNotFound = csError.createCustomError('CommitsTranslatorNotFound', function() {
    var message = 'Could not find a translator for the incoming commits';
    var errors = [message];
    CommitsTranslatorNotFound.prototype.constructor.call(this, errors, 400);
  });

  module.exports = function(req) {
    // TODO: split these out into discrete modules so that it's not all bound
    // up in one place
    if (req.headers.hasOwnProperty('x-github-event')) {
      return require('../translators/githubTranslator');
    }
    
    if (req.get('User-Agent') === 'Bitbucket.org') {
      return require('../translators/bitbucketTranslator');
    }

    var body = JSON.stringify(req.body);

    if (body.indexOf('visualstudio.com/DefaultCollection/_git/') > -1 && JSON.parse(body).resourceVersion === '1.0-preview.1') {
      return require('../translators/vsoTranslator');
    }

    if (body.indexOf('"url":"git@gitlab.com:') > -1) {
      return require('../translators/gitLabTranslator');
    }

    throw new CommitsTranslatorNotFound();
  };
}());