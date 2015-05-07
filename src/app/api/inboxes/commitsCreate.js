(function() {
  var validateUUID = require('../validateUUID'),
    eventStore = require('../helpers/eventStoreClient'),
    commitsAddedFormatAsHal = require('./commitsAddedFormatAsHal'),
    commitsTranslatorFind = require('../helpers/commitsTranslatorFind');

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
        return commitsTranslatorFind(req);
      })
      .then(function(translator) {
        translator.validate(req); // Throws exception if invalid

        if (translator.hasCommits(req)) {
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
        } else {
          translator.respondToNonCommitsMessage(req, res);
        }
      });
  };
}());



    /*
    eventStore.queryStatePartitionById(args)
      .then(function(inbox) {
        digestId = inbox.digestId;
        return githubValidator(req.headers);
      })
      .then(function(eventType) {
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
      });
    */