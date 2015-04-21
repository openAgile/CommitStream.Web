(function() {
  var inboxAdded = require('./inboxAdded'),
      inboxFormatAsHal = require('./inboxFormatAsHal'),
      sanitizeAndValidate = require('../sanitizeAndValidate');

  module.exports = function(req, res) {
    var digestId = req.params.digestId;
    var instanceId = req.instance.instanceId;

    req.body.digestId = digestId;

    sanitizeAndValidate('inbox', req.body, ['family', 'name', 'url'], inboxAdded);

    var args = {
      name: 'digest',
      id: digestId
    };
    
    var inboxAddedEvent = inboxAdded.create(digestId, req.body.family, req.body.name, req.body.url);
    
    eventStore.queryStatePartitionById(args)
      .then(function(digest) {
        var args = {
          name: 'inboxes-' + instanceId,
          events: inboxAddedEvent
        };
        return eventStore.postToStream(args);
      })
      .then(function(inbox) {
        var hypermedia = inboxFormatAsHal(req.href, instanceId, inboxAddedEvent.data);
        res.hal(hypermedia, 201);
      });
  };
}());