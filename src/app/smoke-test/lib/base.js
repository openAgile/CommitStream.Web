(function() {
  var _ = require('underscore'),
    rp = require('request-promise');

  var apiKey = null; // Global and hacky...

  var LOGGING = false;

  function enableLogging(enabled) {
    LOGGING = enabled;
  }

  function getApiKey() {
    return apiKey;
  }

  function getApiKeyAsParam() {
    return '?apiKey=' + getApiKey();
  }

  function href(path) {
    return 'http://localhost:6565/api' + path;
  }

  function post(path, data) {
    return rp(postOptions(href(path), data));
  }

  function postOptions(uri, data, extraHeaders) {
    var headers = {
      "Content-Type": "application/json"
    };

    if (extraHeaders) headers = _.extend(headers, extraHeaders);

    return {
      uri: uri,
      method: 'POST',
      headers: headers,
      transform: function(body) {
        return JSON.parse(body);
      },
      body: JSON.stringify(data)
    };
  }

  function get(uri) {
    return {
      uri: href(uri),
      method: 'GET',
      transform: function(body) {
        return JSON.parse(body);
      },
      headers: {
        "Content-Type": "application/json"
      }
    }
  }

  function getLink(obj, linkName) {
    return obj._links[linkName].href;
  }

  var loggingSeparator = '<hr/>';

  function postToLink(linkName, data, extraHeaders) {
    return function(halResponse) {
      if (LOGGING) {
        console.log('After getting this HAL response:\n\n');
        console.log('```json\n' + JSON.stringify(halResponse, ' ', 2) + '\n```\n\n');
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
  }

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

  module.exports = {
    post: post,
    postToLink: postToLink,
    get: get,
    getApiKey: getApiKey,
    enableLogging: enableLogging
  };

}());