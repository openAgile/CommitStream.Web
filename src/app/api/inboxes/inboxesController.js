(function(inboxesController) {
  var bodyParser = require('body-parser');

  inboxesController.init = function(app) {
    app.post('/api/:instanceId/digests/:digestId/inboxes', bodyParser.json(), require('./inboxCreate'));
    app.post('/api/:instanceId/inboxes/:inboxId/commits', bodyParser.json(), bodyParser.urlencoded(), require('./commitsCreate'));
    app.get('/api/:instanceId/inboxes/:inboxId', require('./inboxGet'));
  };
}(module.exports));