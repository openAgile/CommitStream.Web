(function() {
  var validateUUID = require('../validateUUID'),
    eventStore = require('../helpers/eventStoreClient'),
    translatorFactory = require('../translators/translatorFactory'),
    commitsAddedFormatAsHal = require('./commitsAddedFormatAsHal'),
    csError = require('../../middleware/csError');

  module.exports = function(req, res) {
    var instanceId = req.instance.instanceId,
      digestId = req.inbox.digestId,
      inboxId = req.params.inboxId;

    validateUUID('inbox', inboxId);

    var translator = translatorFactory.create(req);

    if (translator) {
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
          res.hal(hypermedia, 201);
        });
    } else {
      // This would be the case where a translator was not found that could process the
      // payload.
      // log to error somewhere and respond approriately
      var MalformedPushEventError = csError.createCustomError('MalformedPushEventError', function() {
        var message = 'There are no translators that understand the payload you are sending';
        var errors = [message];
        MalformedPushEventError.prototype.constructor.call(this, errors, 400);
      });

      console.log('There are no translators that understand the payload you are sending.')
      console.log('We support translators for GitHub and GitLab.')

      throw new MalformedPushEventError();
    }

  };
}());