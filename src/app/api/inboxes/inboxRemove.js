(function() {
  var inboxRemoved = require('./inboxRemoved'),
    eventStore = require('../helpers/eventStoreClient');

  module.exports = function(req, res) {
    var instanceId = req.instance.instanceId,
      digestId = req.inbox.digestId,
      inboxId = req.params.inboxId;

    var inboxRemovedEvent = inboxRemoved.create(instanceId, digestId, inboxId);

    var args = {
      name: 'inboxes-' + instanceId,
      events: inboxRemovedEvent
    };

    eventStore.postToStream(args).then(function() {
      var responseBody = {
        message: 'The inbox ' + inboxId + ' has been removed from instance ' + instanceId + '.'
      };
      res.status(200).json(responseBody);
    });

  };

}());