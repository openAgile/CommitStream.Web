"use strict";

var _getIterator = require("babel-runtime/core-js/get-iterator")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (href, instanceId, digests) {
  var response = {
    "_links": {
      "self": {
        "href": href("/api/" + instanceId + "/digests")
      }
    },
    "count": digests ? digests.length : 0,
    "_embedded": {
      "digests": []
    }
  };

  var createDigestHyperMediaResult = function createDigestHyperMediaResult(digest) {
    return {
      "_links": {
        "self": {
          "href": href("/api/" + instanceId + "/digests/" + digest.digestId)
        }
      },
      "digestId": digest.digestId,
      "description": digest.description
    };
  };

  if (digests) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _getIterator(digests), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var digest = _step.value;

        response._embedded.digests.push(createDigestHyperMediaResult(digest.content.data));
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
  }

  return response;
};

module.exports = exports["default"];
