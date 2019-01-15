"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _getIterator = require("babel-runtime/core-js/get-iterator")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});
var responderNames = ['tfsGitResponder'];

var responders = responderNames.map(function (name) {
  return require("../responders/" + name);
});
console.log("here inside responderFactory()");

var ResponderFactory = (function () {
  function ResponderFactory() {
    _classCallCheck(this, ResponderFactory);
  }
  console.log("here inside responderFactory().ResponderFactory() before _createClass");
  _createClass(ResponderFactory, [{
    key: "create",
    value: function create(req) {
      console.log("here inside responderFactory().create() before the for");
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _getIterator(responders), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var responder = _step.value;

          console.log("here inside responderFactory().create() inside the for");
          if (responder.canRespond(req)) return responder;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"]) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      console.log("here inside responderFactory().create() it can't respond");
      return undefined;
    }
  }]);

  return ResponderFactory;
})();

exports["default"] = new ResponderFactory();
module.exports = exports["default"];
