(function(digestController) {

  var uuid = require('uuid-v4'),
      config = require('../config');

  digestController.init = function (app) {

    app.post('/api/digest', function(req, res) {
      var response = {};
      var protocol = config.protocol || req.protocol;
      var host = req.get('host');

      response.digestUrl = protocol + '://' + host + '/api/digest/' + uuid();
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