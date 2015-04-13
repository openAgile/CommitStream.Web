(function(digestsController) {

  var uuid = require('uuid-v4'),
    config = require('../config'),
    validator = require('validator'),
    hypermediaResponse = require('./hypermediaResponse'),
    digestAdded = require('./events/digestAdded'),
    eventStore = require('./helpers/eventStoreClient'),
    bodyParser = require('body-parser'),
    sanitize = require('sanitize-html'),
    urls = require('./urls'),
    _ = require('underscore');

  digestsController.init = function(app) {

    /**
     * The hypermedia to creating a digest will have links (see _links below) to other resources
     * that are a result of having created a digest. Those links are identified for documentation
     * purposes via their rel value.
     *
     * @api {post} /api/digest Create a new digest
     * @apiName digest
     *
     * @apiSuccess {String} id - Id of the digest created.
     * @apiSuccess {String} digestUrl - The url of the digest created.
     * @apiSuccess {Array[Object]} _links - Links to other resources as a result of creating a digest.
     *                               rel: 'inbox-form' links to a form for creating a new inbox for a repository.
     **/
    app.post('/api/digests', bodyParser.json(), function(req, res) {
      var contentType = req.get('Content-Type');

      if (!contentType || contentType.toLowerCase() !== 'application/json') {
        res.status(415).send('When creating a digest, you must send a Content-Type: application/json header.');
        return;
      }

      var href = urls.href(req);

      var originalDescription = req.body.description;

      if (originalDescription === undefined) {
        res.status(400).send('A digest must contain a description.');
        return;
      }

      if (originalDescription === null) {
        res.status(400).send('A digest description must not be null.');
        return;
      }

      if (originalDescription.trim().length === 0) {
        res.status(400).send('A digest description must contain a value.');
        return;
      }

      var description = sanitize(req.body.description, {
        allowedTags: []
      });
      if (originalDescription !== description) {
        res.status(400).send('A digest description cannot contain script tags or HTML.');
        return;
      }

      if (description.length > 140) {
        res.status(400).send('A digest description cannot contain more than 140 characters. The description you submitted contains ' + description.length + ' characters.');
        return;
      }

      var digestAddedEvent = digestAdded.create(description);

      var args = {
        name: 'digests',
        events: JSON.stringify([digestAddedEvent])
      };

      eventStore.streams.post(args, function(error, resp) {
        if (error) {
          // WHAT TO DO HERE?? NEED SOME TESTS FOR ERROR CASES.
        } else if (resp && resp.statusCode === 408) {
          return res.sendGenericError('Trouble communicating with eventstore.');
        } else {
          var hypermedia = hypermediaResponse.digests.POST(href,
            digestAddedEvent.data.digestId);

          res.location(hypermedia._links.self.href);
          res.set('Content-Type', 'application/hal+json');
          res.status(201);

          setTimeout(function() {
            res.send(hypermedia);
          }, config.controllerResponseDelay);

        }
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
