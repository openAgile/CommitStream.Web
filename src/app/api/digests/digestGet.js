(function() {
  var digestFormatAsHal = require('./digestFormatAsHal'),
    validateUUID = require('../validateUUID');

  module.exports = function(req, res, next) {
    validateUUID('digests', req.params.digestId);

    var hypermedia = digestFormatAsHal(req.href, req.params.instanceId, req.digest);
    res.hal(hypermedia);

  };
}());