(function() {
  var validateUUID = require('../validateUUID'),
    eventStore = require('../helpers/eventStoreClient'),
    translator = require('../translators/githubTranslator'),
    commitsAddedFormatAsHal = require('./commitsAddedFormatAsHal');

  module.exports = function(req, res) {
    var inboxId = req.params.inboxId;
    var instanceId = req.instance.instanceId;
    var digestId;

    validateUUID('inbox', inboxId);

    var args = {
      name: 'inbox',
      id: inboxId
    };
    //TODO: add a module that validates github headers
    eventStore.queryStatePartitionById(args)
      .then(function(inbox) { //let's pretend for the moment this is a x-github-event push
        digestId = inbox.digestId;
        var events = translator.translatePush(req.body, instanceId, digestId, inboxId);
        var e = JSON.stringify(events);

        var postArgs = {
          name: 'inboxCommits-' + inboxId,
          events: e
        };

        return eventStore.postToStream(postArgs);
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