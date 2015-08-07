(() => {
  let gitHubTranslator = require('../translators/githubTranslator');

  let TranslatorFactory = class {

    create(request) {

      if (gitHubTranslator.canTranslate(request)) {
        return gitHubTranslator; // return correct translator
      } else {
        return undefined;
      }
    }

    pickTranslator(request) {
      // pick the correct translator based on what is inspected out of the request.
    }
  }

  module.exports = new TranslatorFactory();

})();