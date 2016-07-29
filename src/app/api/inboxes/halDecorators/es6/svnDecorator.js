import vcsFamilies from '../../helpers/vcsFamilies';

const svnDecorator = {
  shouldDecorate(request) {
    if (request.family === vcsFamilies.Svn) {
      return true;
    }
    return false;
  },
  decorateHalResponse(request) {
    const family = vcsFamilies.Svn + "-scripts";
    const baseUrl = request._links.self.href;
    request._embedded.family = [{
      "_links": {
        "self": {
          "href": baseUrl + "/script?platform=windows"
        },
        "platform": "windows"
      }
    },
    {
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

export default svnDecorator;