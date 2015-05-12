(function() {
  var csError = require('./csError'),
    eventStore = require('../api/helpers/eventStoreClient');

  var InvalidInstanceToInbox = csError.createCustomError('InvalidInstanceToInbox', function(instanceId, inboxId) {
    var message = 'The inbox ' + inboxId + ' does not exist for instance ' + instanceId;
    var errors = [message];
    InvalidInstanceToInbox.prototype.constructor.call(this, errors, 404);
  });

  module.exports = function(req, res, next, inboxId) {
    eventStore.queryStatePartitionById({
      name: 'inbox',
      id: inboxId
    }).then(function(inbox) {
      if (req.instance.instanceId === inbox.instanceId) {
        next();
      } else {
        throw new InvalidInstanceToInbox(req.instance.instanceId, inboxId);
      }
    });

  };

}());