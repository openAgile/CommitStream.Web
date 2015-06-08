(function(inboxRemoved) {
  var uuid = require('uuid-v4');

  inboxRemoved.create = function(instanceId, digestId, inboxId) {
    var eventId = uuid();
    return {
      eventType: 'InboxRemoved',
      eventId: eventId,
      data: {
        instanceId: instanceId,
        digestId: digestId,
        inboxId: inboxId
      }
    };
  };
}(module.exports));