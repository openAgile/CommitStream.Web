'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

(function () {
  var gitHubTranslator = require('../translators/githubTranslator'),
      gitLabTranslator = require('../translators/gitLabTranslator'),
      bitbucketTranslator = require('../translators/bitbucketTranslator'),
      vsoGitTranslator = require('../translators/vsoGitTranslator');

  var TranslatorFactory = (function () {
    function TranslatorFactory() {
      _classCallCheck(this, TranslatorFactory);
    }

    _createClass(TranslatorFactory, [{
      key: 'create',
      value: function create(request) {
        if (gitHubTranslator.canTranslate(request)) {
          return gitHubTranslator;
        } else if (gitLabTranslator.canTranslate(request)) {
          return gitLabTranslator;
        } else if (bitbucketTranslator.canTranslate(request)) {
          return bitbucketTranslator;
        } else if (vsoGitTranslator.canTranslate(request)) {
          return vsoGitTranslator;
        } else {
          return undefined;
        }
      }
    }]);

    return TranslatorFactory;
  })(); // close the class

  module.exports = new TranslatorFactory();
})();
