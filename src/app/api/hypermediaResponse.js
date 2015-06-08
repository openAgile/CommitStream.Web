(function(hypermediaResponse) {

  var config = require('../config');

  hypermediaResponse.digests = {};
  hypermediaResponse.digests.POST = function(href, digestId) {
    return {
      "_links": {
        "self": {
          "href": href("/api/digests/" + digestId)
        },
        "digests": {
          "href": href("/api/digests")
        },
        "inbox-create": {
          "href": href("/api/inboxes"),
          "method": "POST",
          "title": "Endpoint for creating an inbox for a repository on digest " + digestId + "."
        }
      },
      "digestId": digestId
    };
  };

  hypermediaResponse.digestGET = function(href, digestId, data) {
    var response = {
      "_links": {
        "self": {
          "href": href("/api/digests/" + digestId)
        },
        "digests": {
          "href": href("/api/digests")
        },
        "inbox-create": {
          "href": href("/api/inboxes"),
          "method": "POST",
          "title": "Endpoint for creating an inbox for a repository on digest " + digestId + "."
        },
        "inboxes": {
          "href": href("/api/digests/" + digestId + "/inboxes")
        }
      }
    };

    response.description = data.description;
    response.digestId = data.digestId;

    return response;
  };


  hypermediaResponse.digestsGET = function(href, digests) {

    var response = {
      "_links": {
        "self": {
          "href": href("/api/digests")
        }
      },
      "count": digests ? digests.length : 0,
      "_embedded": {
        "digests": []
      }
    }

    function createDigestHyperMediaResult(digest) {
      return {
        "_links": {
          "self": {
            "href": href("/api/digests/" + digest.digestId)
          }
        },
        "digestId": digest.digestId,
        "description": digest.description
      }
    }

    if (digests) {
      digests.forEach(function(d) {
        response._embedded.digests.push(createDigestHyperMediaResult(d));
      });
    }

    return response;
  }

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
  hypermediaResponse.inboxes.uuid.commits = {};


  hypermediaResponse.inboxes.POST = function(href, inboxId) {
    return {
      "_links": {
        "self": {
          "href": href("/api/inboxes/" + inboxId)
        },
        "add-commit": {
          "href": href("/api/inboxes/" + inboxId + "/commits")
        }
      },
      "inboxId": inboxId
    };
  }

  hypermediaResponse.inboxes.uuid.GET = function(href, dataObject) {
    return {
      "_links": {
        "self": {
          "href": href("/api/inboxes/" + dataObject.inboxId)
        },
        "digest-parent": {
          "href": href("/api/digests/" + dataObject.digestId)
        }
      },
      "family": dataObject.family,
      "name": dataObject.name,
      "url": dataObject.url
    };
  }

  hypermediaResponse.inboxes.uuid.commits.POST = function(href, dataObject) {
    return {
      "_links": {
        "self": {
          "href": href("/api/inboxes/" + dataObject.inboxId)
        },
        "digest-parent": {
          "href": href("/api/digests/" + dataObject.digestId)
        },
        "query-digest": {
          "href": href("/api/query?digestId=" + dataObject.digestId + "&workitem=all")
        }
      },
      "message": "Your push event has been queued to be added to CommitStream."
    };
  }

})(module.exports)