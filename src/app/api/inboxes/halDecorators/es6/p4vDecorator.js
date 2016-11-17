import vcsFamilies from '../../helpers/vcsFamilies';

const p4vDecorator = {
  shouldDecorate(vcsFamily) {
    if (vcsFamily === vcsFamilies.P4V) {
      return true;
    }
    return false;
  },
  ensureHasEmbeddedKey(hypermedia) {
    if (!hypermedia.hasOwnProperty('_embedded')) {
      hypermedia['_embedded'] = {};
    }
    return hypermedia;
  },
  addScriptResource(baseUrl, platform) {
    return {
      "_links": {
        "self": {
          "href": baseUrl + "/script?platform=" + platform
        }
      },
      "platform": platform
    }
  },
  embedScripts(hypermedia) {
    const scriptFamily = vcsFamilies.P4V.toLowerCase() + "-scripts";

    hypermedia._embedded[scriptFamily] = [p4vDecorator.addScriptResource(hypermedia._links.self.href, "windows"),
    p4vDecorator.addScriptResource(hypermedia._links.self.href, "linux")];

    return hypermedia;
  },
  decorateHalResponse(hypermedia) {
    hypermedia = p4vDecorator.ensureHasEmbeddedKey(hypermedia);
    hypermedia = p4vDecorator.embedScripts(hypermedia);
    return hypermedia;
  }
};

export default p4vDecorator;