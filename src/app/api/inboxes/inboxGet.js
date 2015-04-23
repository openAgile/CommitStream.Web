(function() {
  var inboxAdded = require('./inboxAdded'),
    eventStore = require('../helpers/eventStoreClient'),
    inboxFormatAsHal = require('./inboxFormatAsHal'),
    validateUUID = require('../validateUUID');

  module.exports = function(req, res) {
    var inboxId = req.params.inboxId;

    validateUUID('inbox', inboxId);

    eventStore.queryStatePartitionById({
      name: 'inbox',
      id: inboxId
    }).then(function(inbox) {
      res.hal(inboxFormatAsHal(req.href, req.instance.instanceId, inbox));
    });
  };
}());