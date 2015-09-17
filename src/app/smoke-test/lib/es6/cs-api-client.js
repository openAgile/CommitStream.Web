import rp from 'request-promise';

let csBaseUrl = 'http://localhost:6565/api';

let baseUrlSet = url => csBaseUrl = url;

let apiKey = null;

let LOGGING = false;

let enableLogging = enabled => LOGGING = enabled;

let getApiKey = () => apiKey;

let getApiKeyAsParam = () => '?apiKey=' + getApiKey();

let href = path => `${csBaseUrl}${path}`;

let post = (path, data) => rp(postOptions(href(path), data));

let postOptions = (uri, data, extraHeaders) => {
  let headers = {
    "Content-Type": "application/json"
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
      console.log(halResponse._links['teamroom-view'].href + '&apiKey=' + getApiKey());
    }
  }
  if (halResponse.apiKey) apiKey = halResponse.apiKey; // Cheap n dirty
  var link = getLink(halResponse, linkName);
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

export default {
  baseUrlSet,
  post,
  postToLink,
  get,
  getLink,
  getApiKey,
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
