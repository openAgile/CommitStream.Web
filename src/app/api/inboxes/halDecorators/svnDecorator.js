"use strict";

var _interopRequireDefault = require("babel-runtime/helpers/interop-require-default")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helpersVcsFamilies = require('../../helpers/vcsFamilies');

var _helpersVcsFamilies2 = _interopRequireDefault(_helpersVcsFamilies);

var svnDecorator = {
  shouldDecorate: function shouldDecorate(request) {
    if (request.family === _helpersVcsFamilies2["default"].Svn) {
      return true;
    }
    return false;
  },
  decorateHalResponse: function decorateHalResponse(request) {
    var family = _helpersVcsFamilies2["default"].Svn + "-scripts";
    var baseUrl = request._links.self.href;
    request._embedded.family = [{
      "_links": {
        "self": {
          "href": baseUrl + "/script?platform=windows"
        },
        "platform": "windows"
      }
    }, {
      "_links": {
        "self": {
          "href": baseUrl + "/script?platform=linux"
        },
        "platform": "linux"
      }
    }];
    return request;
  }
};

exports["default"] = svnDecorator;
module.exports = exports["default"];
