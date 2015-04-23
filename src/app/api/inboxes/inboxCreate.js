(function() {
  var inboxAdded = require('./inboxAdded'),
      eventStore = require('../helpers/eventStoreClient'),
      inboxFormatAsHal = require('./inboxFormatAsHal'),
      sanitizeAndValidate = require('../sanitizeAndValidate'),
      setTimeout = require('../helpers/setTimeout'),
      config = require('../../config');

  module.exports = function(req, res) {
    var digestId = req.params.digestId;
    var instanceId = req.instance.instanceId;

    req.body.digestId = digestId;

    sanitizeAndValidate('inbox', req.body, ['family', 'name', 'url'], inboxAdded);

    var args = {
      name: 'digest',
      id: digestId
    };
    
    var inboxAddedEvent;
    
    eventStore.queryStatePartitionById(args)
      .then(function(digest) {
        inboxAddedEvent = inboxAdded.create(digestId, req.body.family, req.body.name, req.body.url);
        var args = {
          name: 'inboxes-' + instanceId,
          events: inboxAddedEvent
        };
        return eventStore.postToStream(args);
      })
      .then(function() {
        var hypermedia = inboxFormatAsHal(req.href, instanceId, inboxAddedEvent.data);
        setTimeout(function() {
          res.hal(hypermedia, 201);
        }, config.controllerResponseDelay);
      });
  };
}());