(() => {
  let gitHubTranslator = require('../translators/githubTranslator'),
    gitLabTranslator = require('../translators/gitLabTranslator');

  let TranslatorFactory = class {

      create(request) {
        if (gitHubTranslator.canTranslate(request)) {
          return gitHubTranslator;
        } else if (gitLabTranslator.canTranslate(request)) {
          return gitLabTranslator;
        } else {
          return undefined;
        }
      }
    } // close the class

  module.exports = new TranslatorFactory();

})();