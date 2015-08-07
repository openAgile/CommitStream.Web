(() => {
    var gitHubTranslator = require('../translators/githubTranslator'),
        githubValidator = require('../helpers/githubValidator');
	
    let TranslatorFactory = class {

        create(request) {
            let eventType = githubValidator(request.headers);

            if(eventType === 'push') {
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