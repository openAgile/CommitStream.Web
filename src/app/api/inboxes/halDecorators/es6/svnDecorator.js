import vcsFamilies from '../../helpers/vcsFamilies';

const svnDecorator = {
  shouldDecorate(family) {
    if (family === vcsFamilies.Svn) {
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
    const scriptFamily = vcsFamilies.Svn + "-scripts";

    hypermedia._embedded[scriptFamily] = [svnDecorator.addScriptResource(hypermedia._links.self.href, "windows"), 
    svnDecorator.addScriptResource(hypermedia._links.self.href, "linux")];

    return hypermedia;
  },
  decorateHalResponse(hypermedia) {
    hypermedia = svnDecorator.ensureHasEmbeddedKey(hypermedia);
    hypermedia = svnDecorator.embedScripts(hypermedia);
    return hypermedia;
  }
};

export default svnDecorator;