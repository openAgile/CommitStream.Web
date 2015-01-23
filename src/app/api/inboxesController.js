(function(inboxesController) {

  var uuid = require('uuid-v4'),
    config = require('../config'),
    validator = require('validator'),
    inboxAdded = require('./events/inboxAdded'),
    eventStore = require('./helpers/eventStoreClient'),
    bodyParser = require('body-parser'),
    sanitize = require('./sanitizer').sanitize,
    request = require('request'),
    hypermediaResponse = require('./hypermediaResponse'),
    translator = require('./translators/githubTranslator');

  inboxesController.init = function(app) {

    app.post('/api/inboxes', bodyParser.json(), function(req, res) {
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
        res.status(400).json({
          errors: errors
        });
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
        if (error) {
          console.log(error);
          res.status(500).json({
            errors: 'We had an internal problem. Please retry your request. Error: ' + error
          });
        } else {
          var hypermedia = hypermediaResponse.inboxes.POST(protocol,
            host, inboxAddedEvent.data.inboxId);

          res.location(hypermedia._links.self.href);
          res.set('Content-Type', 'application/hal+json');
          res.status(201);
          res.send(hypermedia);
        }
      });
    });

    app.post('/api/inboxes/:uuid', bodyParser.json(), function(req, res, next) {
      if (!validator.isUUID(req.params.uuid)) {
        res.status(400).send('The value "' + req.params.uuid + '" is not recognized as a valid inbox identifier.');
      } else {
        getPartitionState('inbox', req.params.uuid, function(error, response) {
          if (!error && response.statusCode == 200) {
            var digestId = JSON.parse(response.body).digestId;

            res.set('Content-Type', 'application/json');
            //TODO: all this logic, yikes!
            if (!req.headers.hasOwnProperty('x-github-event')) {
              res.json({
                message: 'Unknown event type.'
              });
            } else if (req.headers['x-github-event'] == 'push') {

              var events = translator.translatePush(req.body, digestId);

              var e = JSON.stringify(events);

              eventStore.streams.post({
                name: 'inboxCommits-' + req.params.uuid,
                events: e
              }, function(error, response) {
                if (error) {
                  console.log(error);
                } else {
                  console.log('Posted to eventstore.');
                  console.log(response.statusCode);
                  res.json({
                    message: 'Your push event has been queued to be added to CommitStream.'
                  });
                }
              });

            } else if (req.headers['x-github-event'] == 'ping') {
              res.json({
                message: 'Pong.'
              });
            } else {
              res.json({
                message: 'Unknown event type.'
              });
            }
          } else {
            res.json({
              message: error
            });
          }
          res.end();
        });
      }
    })

    app.get('/api/inboxes/:uuid', function(req, res, next) {
      if (!validator.isUUID(req.params.uuid)) {
        res.status(400).send('The value "' + req.params.uuid + '" is not recognized as a valid inbox identifier.');
      } else {
        getPartitionState('inbox', req.params.uuid, function(err, resp) {
          if (err) {
            res.status(500).json({
              'error': 'There was an internal error when trying to process your request'
            });
          } else if (!resp.body || resp.body.length < 1) {
            res.status(404).json({
              'error': 'Could not find an inbox with id ' + req.params.uuid
            });
          } else { // all good
            var protocol = config.protocol || req.protocol;
            var host = req.get('host');
            var data = JSON.parse(resp.body);
            var hypermedia = {
              "_links": {
                "self": {
                  "href": protocol + "://" + host + "/api/inboxes/" + req.params.uuid
                },
                "inboxes": {
                  "href": protocol + "://" + host + "/api/inboxes"
                },
                "digest-parent": {
                  "href": protocol + "://" + host + "/api/digests/" + data.digestId
                }
              }
            };
            hypermedia.digestId = data.digestId;
            hypermedia.family = data.family;
            hypermedia.name = data.name;
            hypermedia.url = data.url;
            res.set('Content-Type', 'application/hal+json; charset=utf-8');
            res.status(200).send(hypermedia);
          }
        });
      }
    });

    var getPartitionState = function(name, uuid, callback) {
      eventStore.projection.getState({
        name: name,
        partition: name + '-' + uuid
      }, function(err, resp) {
        callback(err, resp);
      });
    }
  }

})(module.exports);