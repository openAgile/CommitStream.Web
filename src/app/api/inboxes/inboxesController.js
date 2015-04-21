(function(inboxesController) {
  var uuid = require('uuid-v4'),
    config = require('../../config'),
    validator = require('validator'),
    eventStore = require('../helpers/eventStoreClient'),
    bodyParser = require('body-parser'),
    request = require('request'),
    hypermediaResponse = require('../hypermediaResponse'),
    translator = require('../translators/githubTranslator'),
    csError = require('../../middleware/csError');

  inboxesController.init = function(app) {
    app.post('/api/:instanceId/digests/:digestId/inboxes', bodyParser.json(), require('./inboxCreate'));

    app.post('/api/:instanceId/inboxes/:inboxId/commits', bodyParser.json(), require('./commitCreate'));

    app.get('/api/:instanceId/inboxes/:inboxId', require('./inboxGet'));
  };

})(module.exports);