(function() {
  var digestFormatAsHal = require('./digestFormatAsHal'),
    eventStore = require('../helpers/eventStoreClient'),
    validateUUID = require('../validateUUID');

  module.exports = function(req, res, next) {
    validateUUID('digests', req.params.digestId);

    eventStore.queryStatePartitionById({
      name: 'digest',
      id: req.params.digestId
    }).then(function(digest) {
      var hypermedia = digestFormatAsHal(req.href, req.params.instanceId, digest);
      res.hal(hypermedia, 200);
    });
  };
}());