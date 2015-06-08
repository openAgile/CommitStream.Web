(function() {
  var validateUUID = require('../validateUUID'),
    eventStore = require('../helpers/eventStoreClient'),
    translator = require('../translators/githubTranslator'),
    commitsAddedFormatAsHal = require('./commitsAddedFormatAsHal'),
    githubValidator = require('../helpers/githubValidator');

  module.exports = function(req, res) {
    var instanceId = req.instance.instanceId,
      digestId = req.inbox.digestId,
      inboxId = req.params.inboxId;

    validateUUID('inbox', inboxId);

    var eventType = githubValidator(req.headers);

    if (eventType === 'push') {
      var events = translator.translatePush(req.body, instanceId, digestId, inboxId);

      var postArgs = {
        name: 'inboxCommits-' + inboxId,
        events: events
      };

      eventStore.postToStream(postArgs)
        .then(function() {
          var inboxData = {
            inboxId: inboxId,
            digestId: digestId
          };

          var hypermedia = commitsAddedFormatAsHal(req.href, instanceId, inboxData);
          //TODO: ask about this
          //res.location(responseData._links['query-digest'].href);
          res.hal(hypermedia, 201);
        });
    } else if (eventType === 'ping') {
      res.json({
        message: 'Pong.'
      });
    }

  };
}());