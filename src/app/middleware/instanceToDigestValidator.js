(function() {
  var csError = require('./csError'),
    eventStore = require('../api/helpers/eventStoreClient');

  var InvalidInstanceToDigest = csError.createCustomError('InvalidInstanceToDigest', function(instanceId, digestId) {
    var message = 'The digest ' + digestId + ' does not exist for instance ' + instanceId;
    var errors = [message];
    InvalidInstanceToDigest.prototype.constructor.call(this, errors, 404);
  });

  module.exports = function(req, res, next, digestId) {
    eventStore.queryStatePartitionById({
      name: 'digest',
      id: digestId
    }).then(function(digest) {
      if (req.instance.instanceId === digest.instanceId) {
        req.digest = digest;
        next();
      } else {
        throw new InvalidInstanceToDigest(req.instance.instanceId, digestId);
      }
    });

  };

}());