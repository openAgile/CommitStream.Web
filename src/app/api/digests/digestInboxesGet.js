(function() {
  var eventStore = require('../helpers/eventStoreClient'),
    CSError = require('../../middleware/csError'),
    digestInboxesFormatAsHal = require('./digestInboxesFormatAsHal'),
    validateUUID = require('../validateUUID');

  module.exports = function(req, res) {
    var digestId = req.params.digestId;
    var instanceId = req.instance.instanceId;
    var digest = req.digest;

    validateUUID('digest', digestId);

    eventStore.queryStatePartitionById({
      name: 'inboxes-for-digest',
      partition: 'digestInbox-' + digest.digestId
    })
      .then(function(inboxes) {
        var hypermedia = digestInboxesFormatAsHal(req.href, instanceId, digest, inboxes);
        res.hal(hypermedia);
      }).catch(CSError.ProjectionNotFound, function(error) {
        // TODO: log the error?
        var hypermedia = digestInboxesFormatAsHal(req.href, instanceId, digest, {
          inboxes: {}
        });
        res.hal(hypermedia);
      });
  };
}());