'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _helpersVcsFamilies = require('../../helpers/vcsFamilies');

var _helpersVcsFamilies2 = _interopRequireDefault(_helpersVcsFamilies);

var p4vDecorator = {
  shouldDecorate: function shouldDecorate(vcsFamily) {
    if (vcsFamily === _helpersVcsFamilies2['default'].P4V) {
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
    var scriptFamily = _helpersVcsFamilies2['default'].P4V.toLowerCase() + "-scripts";

    hypermedia._embedded[scriptFamily] = [p4vDecorator.addScriptResource(hypermedia._links.self.href, "windows"), p4vDecorator.addScriptResource(hypermedia._links.self.href, "linux")];

    return hypermedia;
  },
  decorateHalResponse: function decorateHalResponse(hypermedia) {
    hypermedia = p4vDecorator.ensureHasEmbeddedKey(hypermedia);
    hypermedia = p4vDecorator.embedScripts(hypermedia);
    return hypermedia;
  }
};

exports['default'] = p4vDecorator;
module.exports = exports['default'];
