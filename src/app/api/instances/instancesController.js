(function(instancesController) {
  var config = require('../../config'),
    instanceAdded = require('../events/instanceAdded'),
    instanceFormatAsHal = require('./instanceFormatAsHal'),
    eventStore = require('../helpers/eventStoreClient'),
    validator = require('validator');

  instancesController.init = function(app) {
    app.post('/api/instances', require('./instanceCreate'));

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