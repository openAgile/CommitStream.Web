(function(digestsController) {
  var bodyParser = require('body-parser');
  digestsController.init = function(app) {
    app.post('/api/:instanceId/digests', bodyParser.json(), require('./digestCreate'));
    //app.get('/api/:instanceId/digests/:digestId', require('./digestGet'));
    app.get('/api/:instanceId/digests', require('./digestsGet'));
  };
}(module.exports));