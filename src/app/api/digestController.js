(function(digestController) {

  var uuid = require('uuid-v4'),
      config = require('../config');

  digestController.init = function (app) {

    app.post('/api/digest', function(req, res) {
      var response;
      var protocol = config.protocol || req.protocol;
      var host = req.get('host');
      var digestId = uuid();

      var hypermedia = {
        'digestUrl': protocol + '://' + host + '/api/digest/' + digestId,
        '_links': [
          {
            'href' : protocol + '://' + host + '/api/digest/' + digestId + '/inbox/new',
            'method': 'GET',
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