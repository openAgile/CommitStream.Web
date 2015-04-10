(function(instancesController) {
  var uuid = require('uuid-v4'),
    config = require('../config'),
    instanceAdded = require('./events/instanceAdded'),
    eventStore = require('./helpers/eventStoreClient'),
    eventStorePromised = require('./helpers/eventStoreClientPromised'),
    statusCodeValidator = require('./statusCodeValidator');

  function instanceFormatAsHal(href, instance) {
    console.log(instance);
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
        events: JSON.stringify([instanceAddedEvent])
      };

      eventStore.streams.post(args, function(error, resp) {
        if (error) {
          throw error;
        } else {
          var hypermedia = instanceFormatAsHal(req.href, instanceAddedEvent.data);
          setTimeout(function() {
            res.hal(hypermedia);
          }, config.controllerResponseDelay);
        }
      });
    });

    function queryStatePartitionById(args, validateEventStoreResponse, formatResponse) {
      var stateArgs = {
        name: args.name,
        partition: args.name + '-' + args.id
      };

      return eventStorePromised.state.getAsync(stateArgs)
        .then(validateEventStoreResponse)
        .then(formatResponse);
    }

    app.get('/api/instances/:instanceId', function(req, res, next) {
      var formatResponse = function(instance) {
        return Promise.resolve(instanceFormatAsHal(req.href, instance));
      };

      if (false) {
      //if (!validator.isUUID(req.params.instanceId)) {
        // TODO response with error
        throw new Error("Must supply a valid instanceId. The value " + req.params.instanceId + ' is invalid.');
      } else {
        queryStatePartitionById({
            name: 'instance',
            id: req.params.instanceId
          },
          statusCodeValidator.validateGetProjection('instance', req.params.instanceId),
          formatResponse
        ).then(function(hypermedia) {
          res.hal(hypermedia);
        });
      }
    });
  };
}(module.exports));