(function() {
  var digestAdded = require('./digestAdded'),
    digestFormatAsHal = require('./digestFormatAsHal'),
    eventStore = require('../helpers/eventStoreClient'),
    sanitize = require('../sanitizer').sanitize,
    config = require('../../config');

  module.exports = function(req, res, next) {
    //TODO: don't leave this here!!!
    function canSendErrors(errors) {
      if (errors.length > 0) {
        res.status(400).json({
          errors: errors
        });
        return true;
      }
      return false;
    }

    var errors = sanitize('digest', req.body, ['description']);
    if (canSendErrors(errors)) {
      return;
    }

    var errors = digestAdded.validate(req.body);
    if (canSendErrors(errors)) {
      return;
    }

    var instanceId = req.instance.instanceId;
    var digestAddedEvent = digestAdded.create(instanceId, req.body.description);

    var args = {
      name: 'digests-' + instanceId,
      events: digestAddedEvent
    };

    eventStore.postToStream(args)
      .then(function() {
        var hypermedia = digestFormatAsHal(req.href, instanceId, digestAddedEvent.data);
        setTimeout(function() {
          res.hal(hypermedia, 201);
        }, config.controllerResponseDelay);
      });
  };
}());