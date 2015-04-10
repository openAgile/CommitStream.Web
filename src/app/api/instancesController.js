(function(instancesController) {
  var uuid = require('uuid-v4'),
    config = require('../config'),
    instanceAdded = require('./events/instanceAdded'),
    eventStore = require('./helpers/eventStoreClient'),
    validator = require('validator');

  function instanceFormatAsHal(href, instance) {
    var formatted = {
      "_links": {
        "self": {
          "href": href("/api/instances/" + instance.instanceId)
        },
        "digests": {
          "href": href("/api/" + instance.instanceId + "/digests")
        },
        "digest-create": {
          "href": href("/api/" + instance.instanceId + "/digests"),
          "method": "POST",
          "title": "Endpoint for creating a digest on instance " + instance.instanceId + "."
        }
      },
      "instanceId": instance.instanceId,
      "apiKey": instance.apiKey
    };

    return formatted;
  }

  instancesController.init = function(app) {
    app.post('/api/instances', function(req, res) {
      var instanceAddedEvent = instanceAdded.create();

      var args = {
        name: 'instances',
        events: instanceAddedEvent
      };

      eventStore.postToStream(args)
        .then(function() {
          var hypermedia = instanceFormatAsHal(req.href, instanceAddedEvent.data);
          setTimeout(function() {
            res.hal(hypermedia, 201);
          }, config.controllerResponseDelay);
        });
    });

    app.get('/api/instances/:instanceId', function(req, res, next) {
      if (!validator.isUUID(req.params.instanceId)) {
        throw new Error("Must supply a valid instanceId. The value " + req.params.instanceId + ' is invalid.');
      } else {
        eventStore.queryStatePartitionById({
          name: 'instance',
          id: req.params.instanceId
        }).then(function(instance) {
          res.hal(instanceFormatAsHal(req.href, instance));
        });
      }
    });
  };
}(module.exports));