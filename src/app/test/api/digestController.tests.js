var express = require('express'),
  app = express(),
  chai = require('chai'),
  should = chai.should(),
  controller = require('../../api/digestController'),
  request = require('supertest'),
  validator = require('validator');
  _ = require('underscore');

chai.config.includeStack = true;

controller.init(app);

postDigest = function(shouldBehaveThusly) {
  request(app)
    .post('/api/digest', 'myfirstdigest')
    .end(shouldBehaveThusly);
};

describe('digestController', function () {
  describe('when creating a digest', function () {
    it('digestUrl should be a valid URI', function(done) {
      postDigest(function(err, res) {
        validator.isURL(res.body.digestUrl).should.be.true;
        done();
      });
    });

    it('should have an id to identify the digest', function(done) {
      postDigest(function(err, res) {
        var id = res.body.id;
        res.body.should.have.property('id');
        done();
      })
    })

    it('id for a digest should be a valid uuid', function(done) {
      postDigest(function(err, res) {
        var id = res.body.id;
        validator.isUUID(id).should.be.true;
        done();
      })
    })

    it('digestUrl should contain the id of the digest', function(done) {
      postDigest(function(err, res) {
        var digestUrlParts = res.body.digestUrl.split('/');
        var id = digestUrlParts[digestUrlParts.length - 1];
        id.should.equal(res.body.id);
        done();
      });
    });

    it('should have links to other resources', function(done) {
      postDigest(function(err, res) {
        res.body.should.include.key('_links');
        done();
      })
    })

    it('should link to an inbox form - v1', function(done) {
      postDigest(function(err, res) {
        res.body.should.have.deep.property('_links[0].rel', 'inbox-form');
        done();
      })
    })

    it('should link to an inbox form - v2', function(done) {
      postDigest(function(err, res) {
        var link = _.find(res.body._links, function(element) { return element.rel === 'inbox-form'; });
        link.should.have.property('rel', 'inbox-form');
        done();
      })
    })

    it('should have an HTTP GET verb to interract with the inbox form ', function(done) {
      postDigest(function(err, res) {
        var link = _.find(res.body._links, function(element) { return element.rel === 'inbox-form'; });
        link.should.have.property('method', 'GET');
        done();
      })
    })

    it('should have a reference to the inbox form', function(done) {
      postDigest(function(err, res) {
        var response = res.body;
        var link = _.find(response._links, function(element) { return element.rel === 'inbox-form'; });
        link.should.have.property('href', response.digestUrl + '/inbox/new');
        done();
      })
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
