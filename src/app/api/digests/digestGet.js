(function() {
  var digestAdded = require('./digestAdded'),
    digestFormatAsHal = require('./digestFormatAsHal'),
    eventStore = require('../helpers/eventStoreClient'),
    sanitize = require('../sanitizer').sanitize,
    config = require('../../config');

  module.exports = function(req, res, next) {
    if (!validator.isUUID(req.params.digestId)) {
      res.status(400).send('The value "' + req.params.digestId + '" is not recognized as a valid digest identifier.');
    } else {
      eventStore.queryStatePartitionById({
        name: 'digest',
        id: req.params.digestId
      }).then(function(digest) {
        var hypermedia = digestFormatAsHal(req.href, req.params.instanceId, digest);
        res.hal(hypermedia, 200);
      });
    }
  };
}());