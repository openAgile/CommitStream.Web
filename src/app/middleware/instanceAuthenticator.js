(function() {
  var csError = require('./csError'),
    eventStore = require('../api/helpers/eventStoreClient');

  var InvalidInstanceApiKey = csError.createCustomError('InvalidInstanceApiKey', function(instanceId) {
    message = 'Invalid apiKey for instance ' + instanceId;
    var errors = [message];
    InvalidInstanceApiKey.prototype.constructor.call(this, errors, 401);
  });

  module.exports = function(req, res, next, instanceId) {
    eventStore.queryStatePartitionById({
      name: 'instance',
      id: instanceId
    }).then(function(instance) {      
      if (instance.apiKey === req.query.apiKey
          ||
          instance.apiKey === req.get('Bearer')) {
        req.instance = instance;
        next();
      } else {
        throw new InvalidInstanceApiKey(instanceId);
      }
    });
  };
}());