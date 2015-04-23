(function() {
  var instanceAdded = require('./instanceAdded'),
      instanceFormatAsHal = require('./instanceFormatAsHal'),
      eventStore = require('../helpers/eventStoreClient'),
      config = require('../../config');

  module.exports = function(req, res, next) {
    var instanceAddedEvent = instanceAdded.create();

    var args = {
      name: 'instances',
      events: instanceAddedEvent
    };

    eventStore.postToStream(args)
      .then(function() {
        var hypermedia = instanceFormatAsHal(req.href, instanceAddedEvent.data);
        setTimeout(function() {
          res.hal(hypermedia, 201);
        }, config.controllerResponseDelay);
      });
  };
}())