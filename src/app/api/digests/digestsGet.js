(function() {
  var eventStore = require('../helpers/eventStoreClient'),
  csError = require('../../middleware/csError'),
  digestsFormatAsHal = require('./digestsFormatAsHal');

	module.exports = function(req, res) {
    var instanceId = req.instance.instanceId;

    var args = {
      name: 'digests-' + instanceId
    };

    eventStore.getFromStream(args)
      .then(function(digests) {
        res.hal(digestsFormatAsHal(req.href, instanceId, digests.entries));
      })
      .catch(csError.StreamNotFound, function(error) {
        res.hal(digestsFormatAsHal(req.href, instanceId));
      });
  };
}());