(function(digestsController) {
  var bodyParser = require('body-parser');
  digestsController.init = function(app) {
    app.post('/api/:instanceId/digests', bodyParser.json(), require('./digestCreate'));
    app.get('/api/:instanceId/digests/:digestId', require('./digestGet'));
    app.get('/api/:instanceId/digests', require('./digestsGet'));
    app.get('/api/:instanceId/digests/:digestId/commits', require('./digestCommitsGet'));
    app.get('/api/:instanceId/digests/:digestId/inboxes', require('./digestInboxesGet'));    
  };
}(module.exports));
