(() => {
  let gitHubTranslator = require('../translators/githubTranslator'),
    gitLabTranslator = require('../translators/gitLabTranslator'),
    bitbucketTranslator = require('../translators/bitbucketTranslator');

  let TranslatorFactory = class {

      create(request) {
        if (gitHubTranslator.canTranslate(request)) {
          return gitHubTranslator;
        } else if (gitLabTranslator.canTranslate(request)) {
          return gitLabTranslator;
        } else if (bitbucketTranslator.canTranslate(request)) {
          return bitbucketTranslator;
        } else {
          return undefined;
        }
      }
    } // close the class

  module.exports = new TranslatorFactory();

})();
