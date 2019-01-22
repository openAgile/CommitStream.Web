'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
var responderNames = ['tfsGitResponder'];

var responders = responderNames.map(function (name) {
  return require('../responders/' + name);
});

var ResponderFactory = (function () {
  function ResponderFactory() {
    _classCallCheck(this, ResponderFactory);
  }

  _createClass(ResponderFactory, [{
    key: 'create',
    value: function create(req) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _getIterator(responders), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var responder = _step.value;

          if (responder.canRespond(req)) return responder;
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

  return ResponderFactory;
})();

exports['default'] = new ResponderFactory();
module.exports = exports['default'];
