"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (href, instanceId, data) {
  var formatted = {
    "_links": {
      "self": {
        "href": href("/api/" + instanceId + "/digests/" + data.digestId)
      },
      "digests": {
        "href": href("/api/" + instanceId + "/digests")
      },
      "inbox-create": {
        "href": href("/api/" + instanceId + "/digests/" + data.digestId + "/inboxes"),
        "method": "POST",
        "title": "Endpoint for creating an inbox for a repository on digest " + data.digestId + "."
      },
      "inboxes": {
        "href": href("/api/" + instanceId + "/digests/" + data.digestId + "/inboxes")
      },
      "teamroom-view": {
        "href": href("/?instanceId=" + instanceId + "&digestId=" + data.digestId)
      }
    }
  };

  formatted.description = data.description;
  formatted.digestId = data.digestId;
  return formatted;
};

module.exports = exports["default"];
