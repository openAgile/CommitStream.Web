(function(inboxesController) {

  var uuid = require('uuid-v4'),
      config = require('../config'),
      validator = require('validator'),
      inboxAdded = require('./events/inboxAdded'),
      eventStore = require('./helpers/eventStoreClient'),
      bodyParser = require('body-parser'),
      sanitize = require('./sanitizer').sanitize;

  inboxesController.init = function (app) {

    app.post('/api/inboxes', bodyParser.json() , function(req, res) {      
      var contentType = req.get('Content-Type');

      if (!contentType || contentType.toLowerCase() !== 'application/json') {
        res.status(415).send('When creating an inbox, you must send a Content-Type: application/json header.');
        return;
      }

      var protocol = config.protocol || req.protocol;
      var host = req.get('host');

      function hasErrors(errors) {
        return errors.length > 0;
      }
      
      function sendErrors(errors) {
        res.status(400).send({errors: errors});
      }     

      var errors = sanitize('inbox', req.body, ['name']);
      if (hasErrors(errors)) {
        sendErrors(errors);
        return;
      }

      errors = inboxAdded.validate(req.body);
      if (hasErrors(errors)) {
        sendErrors(errors);
        return;
      }

      var inboxAddedEvent = inboxAdded.create(req.body.digestId, req.body.family, req.body.name, req.body.url);

      var args = {
        name: 'inboxes',
        events: JSON.stringify([inboxAddedEvent])
      };

      eventStore.streams.post(args, function(error, resp) {
        if(error) {
          // WHAT TO DO HERE?? NEED SOME TESTS FOR ERROR CASES.
        } else {
          var hypermedia = {
            "_links": {
              "self" : { "href": protocol + "://" + host + "/api/inboxes/" + inboxAddedEvent.data.inboxId },
              "inboxes": { "href": protocol + "://" + host + "/api/inboxes" }
            }
          };

          res.location(hypermedia._links.self.href);
          res.set('Content-Type', 'application/hal+json');
          res.status(201);
          res.send(hypermedia);
        }
      });      
    });

    app.get('/api/inboxes/:uuid', function (req, res, next) {
      if (!validator.isUUID(req.params.uuid)) {
        res.status(400).send('The value "' + req.params.uuid + '" is not recognized as a valid inbox identifier.');
      } else {
        eventStore.projection.getState({ name: 'inbox', partition: 'inbox-' + req.params.uuid }, function(err, resp) {
          if (err) {
            res.status(500).json({'error': 'There was an internal error when trying to process your request'});
          } else if (!resp.body || resp.body.length < 1) {
            res.status(404).json({'error': 'Could not find an inbox with id ' + req.params.uuid});
          } else { // all good
            var protocol = config.protocol || req.protocol;
            var host = req.get('host');
            var data = JSON.parse(resp.body);
            var hypermedia = {
              "_links": {
                "self" : { "href": protocol + "://" + host + "/api/inboxes/" + req.params.uuid },
                "inboxes": { "href": protocol + "://" + host + "/api/inboxes" },
                "digest-parent": { "href": protocol + "://" + host + "/api/digests/" + data.digestId }
              }
            };
            hypermedia.digestId = data.digestId;
            hypermedia.family = data.family;
            hypermedia.name = data.name;
            hypermedia.url = data.url;
            res.set('Content-Type', 'application/hal+json; charset=utf-8');
            res.send(hypermedia);
          }
        });
      }
    });
  }

})(module.exports);