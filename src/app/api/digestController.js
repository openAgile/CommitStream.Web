(function(digestController) {

  var uuid = require('uuid-v4'),
      config = require('../config');

  digestController.constructHypermedia = function(protocol, host, digestId) {
    return {
      'id': digestId,
      'digestUrl': protocol + '://' + host + '/api/digest/' + digestId,
      '_links': [
        {
          'href' : protocol + '://' + host + '/api/digest/' + digestId + '/inbox/new',
          'method': 'GET',
          'description': 'Navigate to form for creating an inbox for a repository',
          'rel': 'inbox-form'
        }
      ]
    }
  }

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

      var hypermedia = {
        'id': digestId,
        'digestUrl': protocol + '://' + host + '/api/digest/' + digestId,
        '_links': [
          {
            'href' : protocol + '://' + host + '/api/digest/' + digestId + '/inbox/new',
            'method': 'GET',
            'description': 'Navigate to form for creating an inbox for a repository',
            'rel': 'inbox-form'
          }
        ]
      }

      response = hypermedia;

      res.send(response);
    })
  }

})(module.exports)



// {
//   "digestUrl": "http://host/api/digest/1f1aa47629c44116a3ca08a9bb911309",
//   "_links": [
//     {
//     "href": "http://host/api/digest/1f1aa47629c44116a3ca08a9bb911309/inbox/new",
//     "rel": "inbox",
//     "name": "Navigate to form for creating an inbox for a repository",
//     "method": "GET"
//     }
//   ]
// }