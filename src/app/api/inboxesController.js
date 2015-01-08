(function(inboxesController) {

  var uuid = require('uuid-v4'),
      config = require('../config'),
      validator = require('validator'),
      inboxAdded = require('./events/inboxAdded'),
      eventStore = require('./helpers/eventStoreClient'),
      bodyParser = require('body-parser'),
      sanitize = require('sanitize-html');

  inboxesController.init = function (app) {

    app.post('/api/inboxes', bodyParser.json() , function(req, res) {
      var contentType = req.get('Content-Type');

      if (!contentType || contentType.toLowerCase() !== 'application/json') {
        res.status(415).send('When creating an inbox, you must send a Content-Type: application/json header.');
        return;
      }

      var protocol = config.protocol || req.protocol;
      var host = req.get('host');

      // TODO: use JSON Schema for these validations

      var originalFamily = req.body.family;

      if (originalFamily === undefined) {
        res.status(400).send('An inbox must contain a family.');
        return;        
      }

      if(originalFamily === null) {        
        res.status(400).send('An inbox family must not be null.');
        return;
      }

      if(originalFamily.trim().length === 0) {        
        res.status(400).send('An inbox family must contain a value.');
        return;
      }

      var family = sanitize(req.body.family, {allowedTags: []});
      if (originalFamily !== family) {
        res.status(400).send('An inbox family cannot contain script tags or HTML.');
        return;
      }

      if (family.length > 140) {
        res.status(400).send ('An inbox family cannot contain more than 140 characters. The family you submitted contains ' + family.length + ' characters.');
        return;
      }

      // TODO: validate this
      var digestId = sanitize(req.body.digestId, {allowedTags: []});      
      var name = sanitize(req.body.name, {allowedTags: []});
      var url = sanitize(req.body.url, {allowedTags: []});

      var inboxAddedEvent = inboxAdded.create(digestId, family, name, url);

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