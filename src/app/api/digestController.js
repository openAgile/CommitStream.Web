(function(digestController) {

  var uuid = require('uuid-v4'),
      config = require('../config'),
      validator = require('validator'),
      hypermediaResponse = require('./hypermediaResponse'),
      digestAdded = require('./events/digestAdded'),
      eventStore = require('./helpers/eventStoreClient')
      bodyParser = require('body-parser');

  digestController.init = function (app) {

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
      var protocol = config.protocol || req.protocol;
      var host = req.get('host');

      var digestAddedEvent = digestAdded.create(req.body.description);

      eventStore.pushEventsII('digests', JSON.stringify([digestAddedEvent]), function(err, resp, body) {
        // WHAT TO DO HERE?? NEED SOME TESTS FOR ERROR CASES.
        if(err) {
        }

      })

      var hypermedia = hypermediaResponse.digestPOST(protocol, host, digestAddedEvent.data.digestId);

      res.location(hypermedia._links.self.href);
      res.set('Content-Type', 'application/hal+json');
      res.status(201);

      res.send(hypermedia);
    });

    app.get('/api/digests/:uuid', function (req, res, next) {
      if (!validator.isUUID(req.params.uuid)) {
        res.status(400).send('The value "' + req.params.uuid + '" is not recognized as a valid digest identifier.');
      } else {
        eventStore.getState({ name: 'digest.js', partition: 'digest-' + req.params.uuid }, function(err, resp) {
          if (err) {
            res.status(500).send(err);
          } else if (!resp.body || resp.body.length < 1) {
            // TODO
            res.status(404);
            res.end();
          } else { // our shit is good(resp.body && resp.body.length > 0) {
            res.set('Content-Type', 'application/hal+json');
            res.send(resp.body);
          }
        });
      }
    });
  }

})(module.exports)