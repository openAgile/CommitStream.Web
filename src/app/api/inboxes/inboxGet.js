(function() {
  var inboxFormatAsHal = require('./inboxFormatAsHal'),
    validateUUID = require('../validateUUID');

  module.exports = function(req, res) {
    var inboxId = req.params.inboxId;
    validateUUID('inbox', inboxId);
    res.hal(inboxFormatAsHal(req.href, req.instance.instanceId, req.inbox));
  };
}());