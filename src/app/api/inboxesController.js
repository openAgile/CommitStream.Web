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

      var responseData = {};
      res.set('Content-Type', 'application/json');

      if (!validator.isUUID(req.params.uuid)) {

        responseData = {
          message: 'The value ' + req.params.uuid + ' is not recognized as a valid inbox identifier.'
        };

        res.status(400);

      } else {
        getPartitionState('inbox', req.params.uuid, function(error, response) {

          if (!error && response.statusCode == 200) {

            var digestId = JSON.parse(response.body).digestId;

            //TODO: all this logic, yikes!
            if (!req.headers.hasOwnProperty('x-github-event')) {

              responseData = {
                message: 'Unknown event type.'
              };

            } else if (req.headers['x-github-event'] == 'push') {

              var events = translator.translatePush(req.body, digestId);

              var e = JSON.stringify(events);

              eventStore.streams.post({
                name: 'inboxCommits-' + req.params.uuid,
                events: e
              }, function(error, response) {
                if (error) {
                  responseData = {
                    errors: 'We had an internal problem. Please retry your request. Error: ' + error
                  };

                  res.status(500);
                } else {
                  console.log('Posted to eventstore.');
                  res.set('Content-Type', 'application/hal+json');
                  responseData = {
                    message: 'Your push event has been queued to be added to CommitStream.'
                  };
                }
              });

            } else if (req.headers['x-github-event'] == 'ping') {
              responseData = {
                message: 'Pong.'
              };
            } else {
              responseData = {
                message: 'Unknown event type for x-github-event header : ' + req.headers['x-github-event']
              };
            }
          } else {
            responseData = {
              message: error
            };
          }
        });
      }
      res.send(responseData);
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

            var hypermediaParams = {
              inboxId: req.params.uuid,
              digestId: data.digestId,
              family: data.family,
              name: data.name,
              url: data.url
            }

            var hypermedia = hypermediaResponse.inboxes.uuid.GET(protocol, host, hypermediaParams);

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