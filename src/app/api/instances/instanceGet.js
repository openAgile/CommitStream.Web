(function() {
  instanceFormatAsHal = require('./instanceFormatAsHal'),
  eventStore = require('../helpers/eventStoreClient'),
  validator = require('validator');  

  module.exports = function(req, res) {
    if (!validator.isUUID(req.params.instanceId)) {
      throw new Error('Must supply a valid instanceId. The value ' + req.params.instanceId + ' is invalid.');
    } else {
      eventStore.queryStatePartitionById({
        name: 'instance',
        id: req.params.instanceId
      }).then(function(instance) {
        res.hal(instanceFormatAsHal(req.href, instance));
      });
    }
  };
}())