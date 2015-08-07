'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
  var gitHubTranslator = require('../translators/githubTranslator'),
      gitLabTranslator = require('../translators/gitLabTranslator');

  var TranslatorFactory = (function () {
    function TranslatorFactory() {
      _classCallCheck(this, TranslatorFactory);
    }

    _createClass(TranslatorFactory, [{
      key: 'create',
      value: function create(request) {
        if (gitHubTranslator.canTranslate(request)) {
          return gitHubTranslator; // return correct translator
        } else if (gitLabTranslator.canTranslate(request)) console.log('gitLab can translate this.');else {
            return undefined;
          }
      }
    }, {
      key: 'pickTranslator',
      value: function pickTranslator(request) {
        // pick the correct translator based on what is inspected out of the request.
      }
    }]);

    return TranslatorFactory;
  })(); // close the class

  module.exports = new TranslatorFactory();
})();