(function() {
  var _ = require('underscore');
  var decoratorFactory = require('../inboxes/halDecorators/decoratorFactory');

  module.exports = function(href, instanceId, digest, state) {
    var inboxIds = _.keys(state.inboxes);

    var formatted = {
      "_links": {
        "self": {
          "href": href("/api/" + instanceId + "/digests/" + digest.digestId + "/inboxes"),
        },
        "digest": {
          "href": href("/api/" + instanceId + "/digests/" + digest.digestId)
        },
        "inbox-create": {
          "href": href("/api/" + instanceId + "/digests/" + digest.digestId + "/inboxes"),
          "method": "POST",
          "title": "Endpoint for creating an inbox for a repository on digest " + digest.digestId + "."
        }
      },
      "count": inboxIds.length,
      "digest": {
        "description": digest.description,
        "digestId": digest.digestId
      },
      "_embedded": {
        "inboxes": []
      }
    };

    function createInboxHyperMediaResult(instanceId, inbox) {
      var result = {
        "_links": {
          "self": {
            "href": href("/api/" + instanceId + "/inboxes/" + inbox.inboxId)
          },
          "add-commit": {
            "href": href("/api/" + instanceId + "/inboxes/" + inbox.inboxId + "/commits")
          }
        }
      };

      var halDecorator = decoratorFactory.create(inbox.family);
      if(halDecorator) {      
        result = halDecorator.decorateHalResponse(result);
      };
      result = _.extend(result, _.omit(inbox, 'digestId'));

      return result;
    }

    inboxIds.forEach(function(inboxId) {
      formatted._embedded.inboxes.push(createInboxHyperMediaResult(instanceId, state.inboxes[inboxId]));
    });

    return formatted;
  };
}())