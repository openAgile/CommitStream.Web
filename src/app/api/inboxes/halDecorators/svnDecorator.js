'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _helpersVcsFamilies = require('../../helpers/vcsFamilies');

var _helpersVcsFamilies2 = _interopRequireDefault(_helpersVcsFamilies);

var svnDecorator = {
  shouldDecorate: function shouldDecorate(family) {
    if (family === _helpersVcsFamilies2['default'].Svn) {
      return true;
    }
    return false;
  },
  ensureHasEmbeddedKey: function ensureHasEmbeddedKey(hypermedia) {
    if (!hypermedia.hasOwnProperty('_embedded')) {
      hypermedia['_embedded'] = {};
    }
    return hypermedia;
  },
  addScriptResource: function addScriptResource(baseUrl, platform) {
    return {
      "_links": {
        "self": {
          "href": baseUrl + "/script?platform=" + platform
        }
      },
      "platform": platform
    };
  },
  embedScripts: function embedScripts(hypermedia) {
    var scriptFamily = _helpersVcsFamilies2['default'].Svn.toLowerCase() + "-scripts";

    hypermedia._embedded[scriptFamily] = [svnDecorator.addScriptResource(hypermedia._links.self.href, "windows"), svnDecorator.addScriptResource(hypermedia._links.self.href, "linux")];

    return hypermedia;
  },
  decorateHalResponse: function decorateHalResponse(hypermedia) {
    hypermedia = svnDecorator.ensureHasEmbeddedKey(hypermedia);
    hypermedia = svnDecorator.embedScripts(hypermedia);
    return hypermedia;
  }
};

exports['default'] = svnDecorator;
module.exports = exports['default'];
