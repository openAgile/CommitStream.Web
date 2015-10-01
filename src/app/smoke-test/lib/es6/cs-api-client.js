import rp from 'request-promise';
import familyPayloadExamples from './family-payload-examples';

const loggingSeparator = '<hr/>';

let getLink = (obj, linkName) => obj._links[linkName].href;

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

let postToLink = (client, halResponse, linkName, data, extraHeaders) => {
  if (client.loggingEnabled) {
    console.log('After getting this HAL response:\n\n');
    console.log('```json\n' + JSON.stringify(halResponse, ' ', 2) + '\n```\n\n');
    if (halResponse._links['teamroom-view']) {
      console.log('TEAMROOM LINK:');
      console.log(halResponse._links['teamroom-view'].href + '&apiKey=' + client.apiKey);
    }
  }
  if (halResponse.apiKey) {
    client.apiKey = halResponse.apiKey; // Cheap n dirty
    client.instanceId = halResponse.instanceId;
  }
  let link = getLink(halResponse, linkName);
  if (client.apiKey !== null) link += "?apiKey=" + client.apiKey;

  if (client.loggingEnabled) {
    console.log('We then extract the `' + linkName + '` link from the `_links` property, returning:\n\n');
    console.log('`' + link + '`.\n\n');
    console.log('And then POST the following JSON body to that link:\n\n');
    console.log('```json\n' + JSON.stringify(data, ' ', 2) + '\n```\n\n');
    console.log(loggingSeparator);
  }

  return rp(postOptions(link, data, extraHeaders));
}

let post = (client, path, data) => rp(postOptions(client.href(path), data));

let getOptions = uri => ({
  uri,
  method: 'GET',
  transform: body => JSON.parse(body),
  headers: {
    'Content-Type': 'application/json'
  }
});

let get = (client, uri, alreadyAbsolute) => {
  uri = alreadyAbsolute ? uri : client.href(uri);
  return rp(getOptions(uri));
};

let getFromLink = (client, halResponse, linkName) => {
  let link = getLink(halResponse, linkName);
  if (client.apiKey !== null) link += "?apiKey=" + client.apiKey;
  return get(client, link, true);
};

let postToInboxForFamily = (client, inbox, message, family, extraHeaders) => {
  return postToLink(client, inbox, 'add-commit', familyPayloadExamples[family].validWithOneCommit(message), extraHeaders);
}

let families = {
  GitHub : {
    commitAdd: (client, inbox, message='GitHub commit') => postToInboxForFamily(client, inbox, message, 'GitHub', {'x-github-event': 'push'})
  },
  GitLab : {
    commitAdd: (client, inbox, message='GitLab commit') => postToInboxForFamily(client, inbox, message, 'GitLab', {'x-gitlab-event': 'Push Hook'})
  },
  Bitbucket : {
    commitAdd: (client, inbox, message='Bitbucket commit') => postToInboxForFamily(client, inbox, message, 'Bitbucket', {'x-event-key': 'repo:push'})
  }
};

class CSApiClient {
  constructor(baseUrl = 'http://localhost:6565/api', loggingEnabled = false) {
    this._baseUrl = baseUrl;
    this._loggingEnabled = loggingEnabled;
    this._instanceId = null;
    this._apiKey = null;
  }
  async instanceCreate() {
    return await Instance.create(this);
  }
  async instanceGet(instanceId, apiKey) {
    return await Instance.get(this, instanceId, apiKey);
  }
  get apiKey() { return this._apiKey; }
  set apiKey(val) { this._apiKey = val; }
  get instanceId() { return this._instanceId; }
  set instanceId(val) { this._instanceId = val; }
  get baseUrl() { return this._baseUrl; }
  set baseUrl(val) { this._baseUrl = val; }
  get loggingEnabled() { return this._loggingEnabled; }
  set loggingEnabled(val) { this._loggingEnabled = val; }
  href(path) {
    return `${this.baseUrl}${path}`;
  }
}

let resourceSymbol = Symbol('resource');
let clientSymbol = Symbol('client');

class Resource {
  constructor(client, resource) {
    this[clientSymbol] = client;
    this[resourceSymbol] = resource;
    Reflect.ownKeys(resource).slice(1).forEach(prop => Object.defineProperty(this, prop, {
      get: function() { return resource[prop]; },
      enumerable: true,
      configurable: true
    }));
  }
  async postToLink(linkName, data, ResourceWrapperClass) {
    let resource = await postToLink(this[clientSymbol], this[resourceSymbol], linkName, data);
    return new ResourceWrapperClass(this[clientSymbol], resource);
  }
  async getFromLink(linkName, ResourceWrapperClass) {
    let resource = await getFromLink(this[clientSymbol], this[resourceSymbol], linkName);
    return new ResourceWrapperClass(this[clientSymbol], resource);
  }
  get resource() {
    return this[resourceSymbol];
  }
}

class Instance extends Resource {
  static async create(client) {
    let instanceResource = await post(client, '/instances', {});
    return new Instance(client, instanceResource);
  }
  static async get(client, instanceId, apiKey) {
    client.apiKey = apiKey;
    client.instanceId = instanceId;
    const url = `/instances/${instanceId}?apiKey=${apiKey}`;
    let instanceResource = await get(client, url);
    return new Instance(client, instanceResource);
  }
  async digestCreate(data) {
    return await this.postToLink('digest-create', data, Digest);
  }
  async digestsGet() {
    return await this.getFromLink('digests', Digests);
  }
  async commitsForWorkItemsGet(workitems=[]) {
    const url = `/${this[clientSymbol].instanceId}/commits/tags/versionone/workitem?numbers=${workitems.join(',')}&apiKey=${this[clientSymbol].apiKey}`;
    let commits = await get(this[clientSymbol], url);
    return commits;
  }
};

class Digests extends Resource {
  *[Symbol.iterator]() {
    for(let digest of this.resource._embedded['digests'])
      yield new Digest(this[clientSymbol], digest);
  }
}

class Digest extends Resource {
  // TODO: add inboxes link to the embedded results in digestsGet
  //async inboxesGet() {
  //console.log(JSON.stringify(this.resource));
  //  return await this.getFromLink('inboxes', Inboxes);
  //}  
  async inboxesGet() {
    const url = `/${this[clientSymbol].instanceId}/digests/${this.resource.digestId}/inboxes?apiKey=${this[clientSymbol].apiKey}`;
    let inboxes = await get(this[clientSymbol], url);
    return new Inboxes(this[clientSymbol], inboxes);
  }
  async inboxCreate(data) {
    return await this.postToLink('inbox-create', data, Inbox);
  }
  async commitsGet({page = 0, pageSize = 25} = {}) {
    const url = `/${this[clientSymbol].instanceId}/digests/${this.resource.digestId}/commits?apiKey=${this[clientSymbol].apiKey}&page=${page}&pageSize=${pageSize}`;
    return await get(this[clientSymbol], url);
  }  
}

class Inboxes extends Resource {
}

class Inbox extends Resource {
  async commitCreate(message) {
    let commitResponse = await families[this.family].commitAdd(this[clientSymbol], this[resourceSymbol], message);
    return commitResponse;
  }
}

export default CSApiClient;

/* NOTE: Experimental code that could drive runtime class generation

const resourceSubClassDefinitions = [
  {
    name: 'Instance',
    postToLinkMethods: [
      ['digestCreate', 'digest-create', 'Digest']
    ]
  },
  {
    name: 'Digest',
    postToLinkMethods: [
      ['inboxCreate', 'inbox-create', 'Inbox']
    ]
  }
];

resourceSubClassDefinitions.forEach(def => {
  module[def.name] = class extends Resource {};
  def.postToLinkMethods.forEach(method => {
    const [name, link, resourceWrapperClassName] = method;
    module[def.name].prototype[name] = async function(data) {
      return await this.postToLink(link, module[resourceWrapperClassName]);
    }
  })
});

module.Instance.create = async function() {
  let instanceResource = await post('/instances', {});
  return new Instance(instanceResource);
}
*/