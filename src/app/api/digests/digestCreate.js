(function() {
  var digestAdded = require('./digestAdded'),
    digestFormatAsHal = require('./digestFormatAsHal'),
    eventStore = require('../helpers/eventStoreClient'),
    sanitizeAndValidate = require('../sanitizeAndValidate'),
    setTimeout = require('../helpers/setTimeout'),
    config = require('../../config');

  module.exports = function(req, res, next) {

    sanitizeAndValidate('digest', req.body, ['description'], digestAdded);

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