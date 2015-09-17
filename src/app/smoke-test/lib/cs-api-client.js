'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var csBaseUrl = 'http://localhost:6565/api';

var baseUrlSet = function baseUrlSet(url) {
  return csBaseUrl = url;
};

var apiKey = null;

var LOGGING = false;

var enableLogging = function enableLogging(enabled) {
  return LOGGING = enabled;
};

var getApiKey = function getApiKey() {
  return apiKey;
};

var getApiKeyAsParam = function getApiKeyAsParam() {
  return '?apiKey=' + getApiKey();
};

var href = function href(path) {
  return '' + csBaseUrl + path;
};

var post = function post(path, data) {
  return (0, _requestPromise2['default'])(postOptions(href(path), data));
};

var postOptions = function postOptions(uri, data, extraHeaders) {
  var headers = {
    "Content-Type": "application/json"
  };

  if (extraHeaders) headers = _Object$assign(headers, extraHeaders);

  return {
    uri: uri,
    method: 'POST',
    headers: headers,
    transform: function transform(body) {
      return JSON.parse(body);
    },
    body: JSON.stringify(data)
  };
};

var get = function get(uri, alreadyAbsolute) {
  uri = alreadyAbsolute ? uri : href(uri);
  return {
    uri: uri,
    method: 'GET',
    transform: function transform(body) {
      return JSON.parse(body);
    },
    headers: {
      'Content-Type': 'application/json'
    }
  };
};

var getLink = function getLink(obj, linkName) {
  return obj._links[linkName].href;
};

var loggingSeparator = '<hr/>';

var postToLink = function postToLink(halResponse, linkName, data, extraHeaders) {
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

  return (0, _requestPromise2['default'])(postOptions(link, data, extraHeaders));
};

exports['default'] = {
  baseUrlSet: baseUrlSet,
  post: post,
  postToLink: postToLink,
  get: get,
  getLink: getLink,
  getApiKey: getApiKey,
  enableLogging: enableLogging
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
module.exports = exports['default'];
