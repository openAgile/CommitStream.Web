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
          "title": "Endpoint for creating an inbox for a repository on digest " + digestId + "."
        }
      },
      "digestId": digestId
    };
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
          "title": "Endpoint for creating an inbox for a repository on digest " + digestId + "."
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
  hypermediaResponse.inboxes.uuid = {};

  hypermediaResponse.inboxes.POST = function(protocol, host, inboxId) {
    return {
      "_links": {
        "self": {
          "href": protocol + "://" + host + "/api/inboxes/" + inboxId
        }
      },
      "inboxId": inboxId
    };
  }

  hypermediaResponse.inboxes.uuid.GET = function(protocol, host, dataObject) {
    return {
      "_links": {
        "self": {
          "href": protocol + "://" + host + "/api/inboxes/" + dataObject.inboxId
        },
        "inboxes": {
          "href": protocol + "://" + host + "/api/inboxes",
          "method": "POST",
          "title": "Endpoint for creating an inbox for a repository on a digest."
        },
        "digest-parent": {
          "href": protocol + "://" + host + "/api/digests/" + dataObject.digestId
        }
      },
      "digestId": dataObject.digestId,
      "family": dataObject.family,
      "name": dataObject.name,
      "url": dataObject.url
    };
  }

  hypermediaResponse.inboxes.uuid.POST = function(protocol, host, dataObject) {
    return {
      "_links": {
        "self": {
          "href": protocol + "://" + host + "/api/inboxes/" + dataObject.inboxId
        },
        "digest-parent": {
          "href": protocol + "://" + host + "/api/digests/" + dataObject.digestId
        }
      },
      "message": "Your push event has been queued to be added to CommitStream."
    };
  }

})(module.exports)