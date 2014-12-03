(function(digestController) {

  var uuid = require('uuid-v4'),
      config = require('../config'),
      hypermediaResponse = require('./hypermediaResponse');

  digestController.init = function (app) {

  /**
     * The response to creating a digest will have links (see _links below) to other resources
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
    app.post('/api/digest', function(req, res) {
      var response;
      var protocol = config.protocol || req.protocol;
      var host = req.get('host');
      var digestId = uuid();

      response = hypermediaResponse.digest(protocol, host, digestId);

      res.send(response);
    })
  }

})(module.exports)