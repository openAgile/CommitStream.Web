(function() {
  var csError = require('./csError'),
    eventStore = require('../api/helpers/eventStoreClient');

  var InvalidInstanceInbox = csError.createCustomError('InvalidInboxDigest', function(instanceId, inboxId) {
    var message = 'Invalid digest ' + inboxId + ' for instance ' + instanceId;
    var errors = [message];
    InvalidInstanceInbox.prototype.constructor.call(this, errors, 401);
  });

  module.exports = function(req, res, next, inboxId) {
    eventStore.queryStatePartitionById({
      name: 'inbox',
      id: inboxId
    }).then(function(inbox) {
      if (req.instance.instanceId === inbox.instanceId) {
        next();
      } else {
        throw new InvalidInstanceInbox(req.instance.instanceId, inboxId);
      }
    });

  };

}());