var assert = require('assert'),
  express = require('express'),
  app = express(),
  request = require('supertest'),
  controller = require('../../api/digestController'),
  validator = require('validator');

controller.init(app);

describe('digestController', function () {
  describe('when creating a digest', function () {
    it('should be to a valid uri', function(done) {
      request(app)
            .post('/api/digest', 'myfirstdigest')
            .end(function (err, res) {
              assert.equal(validator.isURL(res.body.digestUrl), true);
              done();
      });
    });

    it('should have a valid uuid as an identifier', function(done) {
      request(app)
            .post('/api/digest', 'myfirstdigest')
            .end(function (err, res) {
              var digestUrlParts = res.body.digestUrl.split('/');
              var id = digestUrlParts[digestUrlParts.length - 1];
              assert.equal(validator.isUUID(id), true);
              done();
      });
    })

  });
});


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
