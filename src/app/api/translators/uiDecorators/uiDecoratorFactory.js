'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
var decoratorNames = ['p4vUiDecorator'];

var decorators = decoratorNames.map(function (name) {
  return require('../uiDecorators/' + name);
});

var UiDecoratorFactory = (function () {
  function UiDecoratorFactory() {
    _classCallCheck(this, UiDecoratorFactory);
  }

  _createClass(UiDecoratorFactory, [{
    key: 'create',
    value: function create(vcsFamily) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _getIterator(decorators), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var decorator = _step.value;

          if (decorator.shouldDecorate(vcsFamily)) return decorator;
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
  }]);

  return UiDecoratorFactory;
})();

exports['default'] = new UiDecoratorFactory();
module.exports = exports['default'];
