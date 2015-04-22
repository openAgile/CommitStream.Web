(function() {
  module.exports = function(href, instanceId, inbox) {
    return {
      "_links": {
        "self": {
          "href": href("/api/" + instanceId + "/inboxes/" + inbox.inboxId +"/commits")
        },
        "digest-parent": {
          "href": href("/api/" + instanceId + "/digests/" + inbox.digestId)
        },
        "query-digest": {
          "href": href("/api/query?digestId=" + inbox.digestId + "&workitem=all")
        }
      },
      "message": "The commits have been added to the CommitStream inbox."
    };
  };
}());