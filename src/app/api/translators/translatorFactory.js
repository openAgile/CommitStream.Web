'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
var translatorNames = ['deveoTranslator', 'githubTranslator', 'gitLabTranslator', 'bitbucketTranslator', 'vsoGitTranslator', 'svnTranslator', 'gitSwarmTranslator', 'p4vTranslator', 'tfvcTranslator'];

var translators = translatorNames.map(function (name) {
  return require('../translators/' + name);
});

var TranslatorFactory = (function () {
  function TranslatorFactory() {
    _classCallCheck(this, TranslatorFactory);
  }

  _createClass(TranslatorFactory, [{
    key: 'create',
    value: function create(req) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _getIterator(translators), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var translator = _step.value;

          if (translator.canTranslate(req)) return translator;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return undefined;
    }
  }, {
    key: 'getByFamily',
    value: function getByFamily(family) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = _getIterator(translators), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var translator = _step2.value;

          if (translator.family === family) return translator;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
            _iterator2['return']();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return undefined;
    }
  }]);

  return TranslatorFactory;
})();

exports['default'] = new TranslatorFactory();
module.exports = exports['default'];
