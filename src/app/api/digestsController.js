(function(digestsController) {
  var config = require('../config'),
    validator = require('validator'),
    hypermediaResponse = require('./hypermediaResponse'),
    digestAdded = require('./events/digestAdded'),
    eventStore = require('./helpers/eventStoreClient'),
    eventStorePromised = require('./helpers/eventStoreClientPromised'),
    bodyParser = require('body-parser'),
    sanitize = require('./sanitizer').sanitize,
    urls = require('./urls'),
    _ = require('underscore');

  function digestFormatAsHal(href, instanceId, data) {
    var formatted = {
      "_links": {
        "self": {
          "href": href("/api/" + instanceId + "/digests/" + data.digestId)
        },
        "digests": {
          "href": href("/api/" + instanceId + "/digests")
        },
        "inbox-create": {
          "href": href("/api/" + instanceId + "/digests/" + data.digestId + "/inboxes"),
          "method": "POST",
          "title": "Endpoint for creating an inbox for a repository on digest " + data.digestId + "."
        },
        "inboxes": {
          "href": href("/api/" + instanceId + "/digests/" + data.digestId + "/inboxes")
        }
      }
    };
    formatted.description = data.description;
    formatted.digestId = data.digestId;
    return formatted;
  }

  digestsController.init = function(app) {
    app.post('/api/:instanceId/digests', bodyParser.json(), function(req, res) {
      //TODO: do not repeat this
      var contentType = req.get('Content-Type');
      if (!contentType || contentType.toLowerCase() !== 'application/json') {
        res.status(415).send('When creating a digest, you must send a Content-Type: application/json header.');
        return;
      }

      //TODO: don't leave this here
      function canSendErrors(errors) {
        if (errors.length > 0) {
          res.status(400).json({
            errors: errors
          });
          return true;
        }
        return false;
      }

      var href = urls.href(req);
      var instanceId = req.params.instanceId;

      var errors = sanitize('digest', req.body, ['description']);
      if (canSendErrors(errors)) {
        return;
      }

      var errors = digestAdded.validate(req.body);
      if (canSendErrors(errors)) {
        return;
      }

      var digestAddedEvent = digestAdded.create(instanceId, req.body.description);

      var args = {
        name: 'digests-' + instanceId,
        events: digestAddedEvent
      };

      eventStore.postToStream(args)
        .then(function() {
          var hypermedia = digestFormatAsHal(href, instanceId, digestAddedEvent.data);
          setTimeout(function() {
            res.hal(hypermedia, 201);
          }, config.controllerResponseDelay);
        });
    });

    app.get('/api/digests/:uuid', function(req, res, next) {
      var href = urls.href(req);
      if (!validator.isUUID(req.params.uuid)) {
        res.status(400).send('The value "' + req.params.uuid + '" is not recognized as a valid digest identifier.');
      } else {
        eventStore.projection.getState({
          name: 'digest',
          partition: 'digest-' + req.params.uuid
        }, function(err, resp) {
          if (err) {
            throw err;
            //return res.sendGenericError();
          } else if (resp && resp.statusCode === 408) {
            return res.sendGenericError('Trouble communicating with eventstore');
          } else if (!resp.body || resp.body.length < 1) {
            res.status(404).json({
              'error': 'Could not find a digest with id ' + req.params.uuid
            });
          } else { // all good
            var data = JSON.parse(resp.body);
            var response = hypermediaResponse.digestGET(href, data.digestId, data);
            res.set('Content-Type', 'application/hal+json; charset=utf-8');
            res.send(response);
          }
        });
      }
    });

    app.get('/api/digests/:uuid/inboxes', function(req, res, next) {
      var href = urls.href(req);

      function createHyperMediaResponse(digest, state) {
        var inboxIds = _.keys(state.inboxes);

        var response = {
          "_links": {
            "self": {
              "href": href("/api/digests/" + digest.digestId + "/inboxes"),
            },
            "digest": {
              "href": href("/api/digests/" + digest.digestId)
            },
            "inbox-create": {
              "href": href("/api/inboxes"),
              "method": "POST",
              "title": "Endpoint for creating an inbox for a repository on digest " + digest.digestId + "."
            }
          },
          "count": inboxIds.length,
          "digest": {
            "description": digest.description,
            "digestId": digest.digestId
          },
          "_embedded": {
            "inboxes": []
          }
        };

        function createInboxHyperMediaResult(inbox) {
          var result = {
            "_links": {
              "self": {
                "href": href("/api/inboxes/" + inbox.inboxId)
              },
              "inbox-commits": {
                "href": href("/api/inboxes/" + inbox.inboxId + "/commits"),
                "method": "POST"
              }
            }
          };

          result = _.extend(result, _.omit(inbox, 'digestId'));

          return result;
        }

        inboxIds.forEach(function(inboxId) {
          response._embedded.inboxes.push(createInboxHyperMediaResult(state.inboxes[inboxId]));
        });

        return response;
      }

      var digest;

      if (!validator.isUUID(req.params.uuid)) {
        res.status(400).json({
          error: 'The value "' + req.params.uuid + '" is not recognized as a valid digest identifier.'
        });
      } else {
        eventStore.projection.getState({
          name: 'digest',
          partition: 'digest-' + req.params.uuid
        }, function(err, resp) {
          if (err) {
            return res.sendGenericError();
          } else if (resp && resp.statusCode === 408) {
            return res.sendGenericError('Trouble communicating with eventstore.');
          } else if (!resp.body || resp.body.length < 1) {
            res.status(404).json({
              'error': 'Could not find a digest with id ' + req.params.uuid + '.'
            });
          } else { // We found a digest, so attempt to get inboxes for the digest
            digest = JSON.parse(resp.body);
            eventStore.projection.getState({
              name: 'inboxes-for-digest',
              partition: 'digestInbox-' + digest.digestId
            }, function(err, resp) {
              if (err) {
                return res.sendGenericError();
              } else if (resp && resp.statusCode === 408) {
                return res.sendGenericError('Trouble communicating with eventstore.');
              } else if (!resp.body || resp.body.length < 1) {
                var hypermediaResponse = JSON.stringify(createHyperMediaResponse(digest, {
                  inboxes: {}
                }));
                res.set('Content-Type', 'application/hal+json; charset=utf-8');
                res.send(hypermediaResponse);
              } else { // all good
                var state = JSON.parse(resp.body);
                var hypermediaResponse = JSON.stringify(createHyperMediaResponse(digest, state));
                res.set('Content-Type', 'application/hal+json; charset=utf-8');
                res.send(hypermediaResponse);
              }
            });
          }
        });
      }
    });

    app.get('/api/digests', bodyParser.json(), function(req, res) {
      var href = urls.href(req);
      eventStorePromised.streams.getAsync({name:'digests'})
      
      eventStore.streams.get({
        name: 'digests'
      }, function(err, resp) {
        if (err) {
          return res.sendGenericError();
        } else if (resp && resp.statusCode === 408) {
          return res.sendGenericError('Trouble communicating with eventstore.');
        } else if (resp.statusCode == 404) {
          var response = hypermediaResponse.digestsGET(href);
          res.set('Content-Type', 'application/hal+json; charset=utf-8');
          res.send(response);
        } else {
          var data = JSON.parse(resp.body);
          var digests = _.map(data.entries, function(entry) {
            return entry.content.data;
          });
          var response = hypermediaResponse.digestsGET(href, digests);
          res.set('Content-Type', 'application/hal+json; charset=utf-8');
          res.send(response);
        }
      });
    });

    /* ASYNC VERSION
    app.get('/api/digests', bodyParser.json(), function(req, res) {
      var href = urls.href(req);
      eventStore.streams.getAsync({name:'digests'})
      .then(function(response) {
        if (response.statusCode === 404) {
          var result = hypermediaResponse.digestsGET(href);
          res.set('Content-Type', 'application/hal+json; charset=utf-8');
          res.send(result);
        } else {       
          console.log("--------------------HERE IS THE RESPONSE");
          console.log(response.body);
          console.log('--------------------DONE RESPONSE');
          var data = JSON.parse(response.body);
          var digests = _.map(data.entries, function(entry) {
            return entry.content.data;
          });
          var response = hypermediaResponse.digestsGET(href, digests);
          res.set('Content-Type', 'application/hal+json; charset=utf-8');
          res.send(response);
        }
      });
    });
    /* ASYNC VERSION
    app.get('/api/digests', bodyParser.json(), function(req, res) {
      var href = urls.href(req);
      eventStore.streams.getAsync({name:'digests'})
      .then(function(response) {
        if (response.statusCode === 404) {
          var result = hypermediaResponse.digestsGET(href);
          res.set('Content-Type', 'application/hal+json; charset=utf-8');
          res.send(result);
        } else {
          var data = JSON.parse(response.body);
          var digests = _.map(data.entries, function(entry) {
            return entry.content.data;
          });
          var response = hypermediaResponse.digestsGET(href, digests);
          res.set('Content-Type', 'application/hal+json; charset=utf-8');
          res.send(response);
        }
      });
    });
    */
  };
})(module.exports);
