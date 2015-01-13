(function(hypermediaResponse) {

  hypermediaResponse.digestPOST = function(protocol, host, digestId) {
    return {
      "_links": {
        "self": {
          "href": protocol + "://" + host + "/api/digests/" + digestId
        },
        "digests": {
          "href": protocol + "://" + host + "/api/digests"
        },
        "inbox-create": {
          "href": protocol + "://" + host + "/api/inboxes",
          "method": "POST",
          "title": "Endpoint for creating an inbox for a repository on digest " + digestId
        }
      }
    }
  };

  hypermediaResponse.digestGET = function(protocol, host, digestId, data) {
    var response = {
      "_links": {
        "self": {
          "href": protocol + "://" + host + "/api/digests/" + digestId
        },
        "digests": {
          "href": protocol + "://" + host + "/api/digests"
        },
        "inbox-create": {
          "href": protocol + "://" + host + "/api/inboxes",
          "method": "POST",
          "title": "Endpoint for creating an inbox for a repository on digest " + digestId
        }
      }
    };

    response.description = data.description;
    response.digestId = data.digestId;

    return response;
  };
})(module.exports)