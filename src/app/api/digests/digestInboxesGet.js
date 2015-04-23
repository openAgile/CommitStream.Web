(function() {
  var eventStore = require('../helpers/eventStoreClient'),
    digestInboxesFormatAsHal = require('./digestInboxesFormatAsHal'),
    validateUUID = require('../validateUUID');

  module.exports = function(req, res) {
    var digestId = req.params.digestId;
    var instanceId = req.instance.instanceId;

    validateUUID('digest', digestId);

    var args = {
      name: 'digest',
      id: digestId
    };
    
    eventStore.queryStatePartitionById(args)
      .then(function(digest) {
        var args = {
          name: 'inboxes-for-digest',
          partition: 'digestInbox-' + digest.digestId
        };
        eventStore.queryStatePartitionById(args)
        .then(function(inboxes) {
          var hypermedia = digestInboxesFormatAsHal(req.href, instanceId, digest, inboxes);        
          res.hal(hypermedia);
        }).catch(function(error) {
          var hypermedia = digestInboxesFormatAsHal(req.href, instanceId, digest, { inboxes: {} });
          res.hal(hypermedia);
        });
      });
  };
}());