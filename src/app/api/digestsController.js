(function(digestsController) {

  var uuid = require('uuid-v4'),
      config = require('../config'),
      validator = require('validator'),
      hypermediaResponse = require('./hypermediaResponse'),
      digestAdded = require('./events/digestAdded'),
      eventStore = require('./helpers/eventStoreClient'),
      bodyParser = require('body-parser'),
      sanitize = require('sanitize-html');

  digestsController.init = function (app) {

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
    app.post('/api/digests', bodyParser.json() , function(req, res) {
      var contentType = req.get('Content-Type');

      if (!contentType || contentType.toLowerCase() !== 'application/json') {
        res.status(415).send('When creating a digest, you must send a Content-Type: application/json header.');
        return;
      }

      var protocol = config.protocol || req.protocol;
      var host = req.get('host');

      var originalDescription = req.body.description;

      if (originalDescription === undefined) {
        res.status(400).send('A digest must contain a description.');
        return;        
      }

      if(originalDescription === null) {        
        res.status(400).send('A digest description must not be null.');
        return;
      }

      if(originalDescription.trim().length === 0) {        
        res.status(400).send('A digest description must contain a value.');
        return;
      }

      var description = sanitize(req.body.description, {allowedTags: []});
      if (originalDescription !== description) {
        res.status(400).send('A digest description cannot contain script tags or HTML.');
        return;
      }

      if (description.length > 140) {
        res.status(400).send ('A digest description cannot contain more than 140 characters. The description you submitted contains ' + description.length + ' characters.');
        return;
      }

      var digestAddedEvent = digestAdded.create(description);

      var args = {
        name: 'digests',
        events: JSON.stringify([digestAddedEvent])
      };

      eventStore.streams.post(args, function(error, resp) {
        if(error) {
          // WHAT TO DO HERE?? NEED SOME TESTS FOR ERROR CASES.
        } else {
          var hypermedia = hypermediaResponse.digestPOST(protocol, 
            host, digestAddedEvent.data.digestId);

          res.location(hypermedia._links.self.href);
          res.set('Content-Type', 'application/hal+json');
          res.status(201);
          res.send(hypermedia);
        }
      });      
    });

    app.get('/api/digests/:uuid', function (req, res, next) {
      if (!validator.isUUID(req.params.uuid)) {
        res.status(400).send('The value "' + req.params.uuid + '" is not recognized as a valid digest identifier.');
      } else {
        eventStore.projection.getState({ name: 'digest', partition: 'digest-' + req.params.uuid }, function(err, resp) {
          if (err) {
            res.status(500).json({'error': 'There was an internal error when trying to process your request'});
          } else if (!resp.body || resp.body.length < 1) {
            res.status(404).json({'error': 'Could not find a digest with id ' + req.params.uuid});
          } else { // all good
            res.set('Content-Type', 'application/hal+json');
            res.send(resp.body);
          }
        });
      }
    });
  }

})(module.exports);