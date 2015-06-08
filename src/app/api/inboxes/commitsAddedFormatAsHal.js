(function() {
  module.exports = function(href, instanceId, inbox) {
    return {
      "_links": {
        "self": {
          "href": href("/api/" + instanceId + "/inboxes/" + inbox.inboxId + "/commits")
        },
        "digest-parent": {
          "href": href("/api/" + instanceId + "/digests/" + inbox.digestId)
        },
        "digest-query": {
          "href": href("/api/" + instanceId + "/digests/" + inbox.digestId + "/commits")
        },
        "instance-query": {
          "href": href("/api/" + instanceId + "/commits/tags/versionone/workitems/:workitems")
        }
      },
      "message": "The commits have been added to the CommitStream inbox."
    };
  };
}());