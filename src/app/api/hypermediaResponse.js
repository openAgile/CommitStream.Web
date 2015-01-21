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
      },
      "digestId": digestId
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

  // These are difficult to name. Here are some ideas
  // For an endpoint like: /api/digests/id/inbox/id
  // hypermediaResponseForADigestAndInbox
  // hypermediaResponse.digests.id.inbox.id

  // Here are some thoughts around the inbox cases of
  // posting to /api/inboxes
  // posting to /api/inboxes/:uuid
  // geting from /api/inboxes/:uuid
  // hypermediaResponseInboxCreation
  // hypermediaResponseInboxPost
  // hypermediaResponseInboxInformation
  // hypermediaResponse.inboxes.POST
  // hypermediaResponse.inboxes.id.POST
  // hypermediaResponse.inboxes.id.GET

  // If we were using a hal library, this would probably look something like
  // halResponse.addLink(key, value), which removes the need to name them specifically.

  hypermediaResponse.inboxes = {};
  hypermediaResponse.inboxes.POST = function(protocol, host, inboxId) {
    return {
      "_links": {
        "self": {
          "href": protocol + "://" + host + "/api/inboxes/" + inboxId
        }
      }
    }
  }

})(module.exports)


