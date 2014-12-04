(function(inboxController) {

  var uuid = require('uuid-v4'),
      config = require('../config'),
      hypermediaResponse = require('./hypermediaResponse');

  inboxController.init = function (app) {
    app.post('/api/inbox', function(req, res) {
        var protocol = config.protocol || req.protocol;
        var host = req.get('host');
        var inboxId = uuid();

        var response = hypermediaResponse.inbox(protocol, host, inboxId);

        res.send(response);
    })
  }

})(module.exports)