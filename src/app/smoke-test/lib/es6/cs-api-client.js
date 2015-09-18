import rp from 'request-promise';
import familyPayloadExamples from './family-payload-examples';

let csBaseUrl = 'http://localhost:6565/api';

let instanceId = null;

let apiKey = null;

let LOGGING = false;

let enableLogging = enabled => LOGGING = enabled;

let href = path => `${csBaseUrl}${path}`;

let post = (path, data) => rp(postOptions(href(path), data));

let postOptions = (uri, data, extraHeaders) => {
  let headers = {
    'Content-Type': 'application/json'
  };

  if (extraHeaders) headers = Object.assign(headers, extraHeaders);

  return {
    uri,
    method: 'POST',
    headers,
    transform: body => JSON.parse(body),
    body: JSON.stringify(data)
  };  
};

let get = (uri, alreadyAbsolute) => {
  uri = alreadyAbsolute ? uri : href(uri);
  return {
    uri,
    method: 'GET',
    transform: body => JSON.parse(body),
    headers: {
      'Content-Type': 'application/json'
    }
  }
};
  
let getLink = (obj, linkName) => obj._links[linkName].href;

const loggingSeparator = '<hr/>';

let postToLink = (halResponse, linkName, data, extraHeaders) => {
  if (LOGGING) {
    console.log('After getting this HAL response:\n\n');
    console.log('```json\n' + JSON.stringify(halResponse, ' ', 2) + '\n```\n\n');
    if (halResponse._links['teamroom-view']) {
      console.log('TEAMROOM LINK:');
      console.log(halResponse._links['teamroom-view'].href + '&apiKey=' + apiKey);
    }
  }
  if (halResponse.apiKey) {
    apiKey = halResponse.apiKey; // Cheap n dirty
    instanceId = halResponse.instanceId;
  }
  let link = getLink(halResponse, linkName);
  if (apiKey !== null) link += "?apiKey=" + apiKey;

  if (LOGGING) {
    console.log('We then extract the `' + linkName + '` link from the `_links` property, returning:\n\n');
    console.log('`' + link + '`.\n\n');
    console.log('And then POST the following JSON body to that link:\n\n');
    console.log('```json\n' + JSON.stringify(data, ' ', 2) + '\n```\n\n');
    console.log(loggingSeparator);
  }

  return rp(postOptions(link, data, extraHeaders));
};


let postToInboxForFamily = (inbox, message, family, extraHeaders) => {
  return postToLink(inbox, 'add-commit', familyPayloadExamples[family].validWithOneCommit(message), extraHeaders);
}

let families = {
  GitHub : {
    commitAdd: (inbox, message='GitHub commit') => postToInboxForFamily(inbox, message, 'GitHub', {'x-github-event': 'push'})
  },
  GitLab : {
    commitAdd: (inbox, message='GitLab commit') => postToInboxForFamily(inbox, message, 'GitLab', {'x-gitlab-event': 'Push Hook'})
  },
  Bitbucket : {
    commitAdd: (inbox, message='Bitbucket commit') => postToInboxForFamily(inbox, message, 'Bitbucket', {'x-event-key': 'repo:push'})
  }
};

let resourceSymbol = Symbol('resource');

class Resource {
  constructor(resource) {
    this[resourceSymbol] = resource;
    Reflect.ownKeys(resource).slice(1).forEach(prop => Object.defineProperty(this, prop, {
      get: function() { return resource[prop]; },
      enumerable: true,
      configurable: true
    }));
  }
  async postToLink(linkName, data, ResourceWrapperClass) {
    let resource = await postToLink(this[resourceSymbol], linkName, data);
    return new ResourceWrapperClass(resource);
  }
}

class Instance extends Resource {
  static async create() {
    let instanceResource = await post('/instances', {});
    return new Instance(instanceResource);
  }
  async digestCreate(data) {
    return await this.postToLink('digest-create', data, Digest);
  }
};

class Digest extends Resource {
  async inboxCreate(data) {
    return await this.postToLink('inbox-create', data, Inbox);
  }
}

class Inbox extends Resource {
  async commitCreate(message) {
    let commitResponse = await families[this.family].commitAdd(this[resourceSymbol], message);
    return commitResponse;
  }
}

export default {
  Instance,
  set baseUrl(url) { csBaseUrl = url; },
  get baseUrl() { return csBaseUrl; },
  get instanceId() { return instanceId; },
  get apiKey() { return apiKey; },
  enableLogging
};

/* TODO
function getFromLink(linkName, query, extraHeaders) {
  return function(halResponse) {
    if(LOGGING) {
      console.log('HAL RESPONSE:');
      console.log(halResponse);
      console.log(sep);      
    }
    var link = getLink(halResponse, linkName);
    if (apiKey !== null) link += "?apiKey=" + apiKey;
    return rp(get(link))
  };
}
*/
