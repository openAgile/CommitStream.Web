(function() {
  instanceFormatAsHal = require('./instanceFormatAsHal'),
  eventStore = require('../helpers/eventStoreClient'),
  validateUUID = require('../validateUUID');

  module.exports = function(req, res) {
    var instanceId = req.params.instanceId;

    validateUUID('instance', instanceId);

    eventStore.queryStatePartitionById({
      name: 'instance',
      id: instanceId
    }).then(function(instance) {
      res.hal(instanceFormatAsHal(req.href, instance));
    });
    
  };
}())