(function() {
  var digestFormatAsHal = require('./digestFormatAsHal'),
    validateUUID = require('../validateUUID');

  module.exports = function(req, res, next) {
    validateUUID('digests', req.params.digestId);

    var digest = {
      digestId: req.digest.digestId,
      description: req.digest.description
    }

    var hypermedia = digestFormatAsHal(req.href, req.params.instanceId, digest);
    res.hal(hypermedia);

  };
}());