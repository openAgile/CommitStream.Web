(function() {
  var csError = require('./csError'),
    eventStore = require('../api/helpers/eventStoreClient');

  var InvalidInstanceDigest = csError.createCustomError('InvalidInstanceDigest', function(instanceId, digestId) {
    var message = 'Invalid digest ' + digestId + ' for instance ' + instanceId;
    var errors = [message];
    InvalidInstanceDigest.prototype.constructor.call(this, errors, 401);
  });

  module.exports = function(req, res, next, digestId) {
    eventStore.queryStatePartitionById({
      name: 'digest',
      id: digestId
    }).then(function(digest) {
      if (req.instance.instanceId === digest.instanceId) {
        next();
      } else {
        throw new InvalidInstanceDigest(req.instance.instanceId, digestId);
      }
    });

  };

}());