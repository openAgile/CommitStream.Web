(() => {
  let gitHubTranslator = require('../translators/githubTranslator'),
    gitLabTranslator = require('../translators/gitLabTranslator');

  let TranslatorFactory = class {

      create(request) {
        if (gitHubTranslator.canTranslate(request)) {
          return gitHubTranslator;
        } else if (gitLabTranslator.canTranslate(request))
        else {
          return undefined;
        }
      }

      pickTranslator(request) {
        // pick the correct translator based on what is inspected out of the request.
      }
    } // close the class

  module.exports = new TranslatorFactory();

})();