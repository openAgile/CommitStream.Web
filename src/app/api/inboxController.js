(function(inboxController) {

  var uuid = require('uuid-v4'),
      config = require('../config');

  inboxController.constructHypermedia = function(protocol, host, inboxId) {
    return {
          'id': inboxId,
          'inboxUrl': protocol + '://' + host + '/api/inbox/' + inboxId,
          '_links': [
            {
              'href' : protocol + '://' + host + '/api/digest/new',
              'method': 'GET',
              'description': 'Navigate to form for creating digest for a group of inboxes',
              'rel': 'digest-form'
            }
          ]
        }
  }

  inboxController.init = function (app) {
    app.post('/api/inbox', function(req, res) {
        var protocol = config.protocol || req.protocol;
        var host = req.get('host');
        var inboxId = uuid();

        var response = inboxController.constructHypermedia(protocol, host, inboxId);

        res.send(response);
    })
  }



})(module.exports)