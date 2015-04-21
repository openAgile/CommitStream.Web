(function() {
  var validateUUID = require('../validateUUID'),
    eventStore = require('../helpers/eventStoreClient'),
    translator = require('../translators/githubTranslator'),
    commitsAddedFormatAsHal = require('./commitsAddedFormatAsHal'),
    githubValidator = require('../helpers/githubValidator');

  module.exports = function(req, res) {
    var inboxId = req.params.inboxId;
    var instanceId = req.instance.instanceId;
    var digestId;

    validateUUID('inbox', inboxId);

    var args = {
      name: 'inbox',
      id: inboxId
    };

    eventStore.queryStatePartitionById(args)
      .then(function(inbox) {
        digestId = inbox.digestId;
        return githubValidator(req.headers);
      })
      .then(function(eventType) {
        if (eventType === 'push') {
          var events = translator.translatePush(req.body, instanceId, digestId, inboxId);
          var e = JSON.stringify(events);

          var postArgs = {
            name: 'inboxCommits-' + inboxId,
            events: e
          };
          return eventStore.postToStream(postArgs);
        } else if (eventType === 'ping') {
          res.status(200).send({
            message: 'Pong.'
          });
        }
      })
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
  };
}());