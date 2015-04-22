(function() {
  module.exports = function(href, instanceId, inbox) {
    return {
      "_links": {
        "self": {
          "href": href("/api/" + instanceId + "/inboxes/" + inbox.inboxId)
        },
        "digest-parent": {
          "href": href("/api/" + instanceId + "/digests/" + inbox.digestId)
        },
        "add-commit": {
          "href": href("/api/" + instanceId + "/inboxes/" + inbox.inboxId + "/commits")
        }
      },
      "inboxId": inbox.inboxId,
      "family": inbox.family,
      "name": inbox.name,
      "url": inbox.url,
    };
  };
}());