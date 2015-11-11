(() => {
  const gitHubTranslator = require('../translators/githubTranslator'),
    gitLabTranslator = require('../translators/gitLabTranslator'),
    bitbucketTranslator = require('../translators/bitbucketTranslator'),
    vsoTranslator = require('../translators/vsoTranslator');

  const TranslatorFactory = class {

      create(request) {
        if (gitHubTranslator.canTranslate(request)) {
          return gitHubTranslator;
        } else if (gitLabTranslator.canTranslate(request)) {
          return gitLabTranslator;
        } else if (bitbucketTranslator.canTranslate(request)) {
          return bitbucketTranslator;
        } else if (vsoTranslator.canTranslate(request)) {
          return vsoTranslator;
        } else {
          return undefined;
        }
      }
    } // close the class

  module.exports = new TranslatorFactory();

})();
