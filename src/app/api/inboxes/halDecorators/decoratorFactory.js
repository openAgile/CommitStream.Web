'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
var decoratorNames = ['svnDecorator'];

var decorators = decoratorNames.map(function (name) {
  return require('../halDecorators/' + name);
});

var DecoratorFactory = (function () {
  function DecoratorFactory() {
    _classCallCheck(this, DecoratorFactory);
  }

  _createClass(DecoratorFactory, [{
    key: 'create',
    value: function create(req) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _getIterator(decorators), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var decorator = _step.value;

          if (decorator.shouldDecorate(req)) return decorator;
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

  return DecoratorFactory;
})();

exports['default'] = new DecoratorFactory();
module.exports = exports['default'];
