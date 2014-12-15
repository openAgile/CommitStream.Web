var chai = require('chai'),
  should = chai.should(),
  express = require('express'),
  app = express(),
  chai = require('chai'),
  sinon = require("sinon"),
  sinonChai = require("sinon-chai"),
  request = require('supertest'),
  proxyquire = require('proxyquire'),
  hypermediaResponseStub = { digestPOST: sinon.stub() },
  digestAdded = { create: sinon.stub() },
  controller = proxyquire('../../api/digestController',
      { './hypermediaResponse' : hypermediaResponseStub,
        './events/digestAdded' : digestAdded
      }
    );

chai.use(sinonChai);
chai.config.includeStack = true;

controller.init(app);

function postDigest(payload, shouldBehaveThusly) {
  request(app)
    .post('/api/digest')
    .send(payload)
    .end(shouldBehaveThusly);
};

function getDigest(path, shouldBehaveThusly) {
  request(app)
    .get(path)
    .end(shouldBehaveThusly);
}

describe('digestController', function () {
  describe('when creating a digest', function() {
    var hypermediaResponse;
    var protocol;
    var host;
    var digestAddedEvent;

    before(function() {
      var digestId = '7f74aa58-74e0-11e4-b116-123b93f75cba';

      digestAddedEvent = {
        eventType: 'DigestAdded',
        eventId: '87b66de8-8307-4e03-b2d3-da447c66501a',
        data: {
          digestId: digestId,
          description: 'my first digest'
        }
      };

      protocol = 'http';
      host = 'localhost';

      hypermediaResponse = {
      "_links": {
        "self" : { "href": protocol + "://" + host + "/api/digests/" + digestId }
      }

    }

      digestAdded.create.returns(digestAddedEvent);
      hypermediaResponseStub.digestPOST.returns(hypermediaResponse);
    })

    it('it should use proper arguments when creating hypermedia.', function(done) {
      postDigest({}, function(err, res) {
        hypermediaResponseStub.digestPOST.should.have.been.calledWith(protocol, sinon.match.any, digestAddedEvent.data.digestId);
        done();
      });
    });

    it('it should create the DigestAdded event.', function(done) {
      var digestDescription = { description: 'myfirstdigest' };
      postDigest(digestDescription, function(err, res) {
        digestAdded.create.should.have.been.calledWith(digestDescription.description);
        done();
      });
    });

    it('it should have a response Content-Type of hal+json', function(done) {
      var digestDescription = { description: 'myfirstdigest' };
      postDigest(digestDescription, function(err, res) {
        res.header['content-type'].should.equal('application/hal+json; charset=utf-8');
        done();
      });
    })

    it('it should set the Location response header to the newly created digest', function(done) {
      var digestDescription = { description: 'myfirstdigest' };
      postDigest(digestDescription, function(err, res) {
        res.header['location'].should.equal(hypermediaResponse._links.self.href);
        done();
      });
    })

    it('it should have a response code of 201 created', function(done) {
      var digestDescription = { description: 'myfirstdigest' };
      postDigest(digestDescription, function(err, res) {
        res.status.should.equal(201);
        done();
      });
    })

  });

  describe('when requesting a digest', function() {
    describe('with an invalid, non-uuid digest identifier', function() {
      function get(shouldBehaveThusly) {
        getDigest('/api/digest/not_a_uuid', shouldBehaveThusly);
      }
      it('it returns a 400 status code', function(done) {
        get(function(err, res) {
            res.statusCode.should.equal(400);
            done();
        });
      });
      it('it returns a meaningful error message in the body', function(done) {
        get(function(err, res) {
            res.text.should.equal('The value "not_a_uuid" is not recognized as a valid digest identifier.');
            done();
        });
      });
    });
    describe('with a valid, uuid digest identifier', function() {
      var uuid = 'e9be4a71-f6ca-4f02-b431-d74489dee5d0';
      function get(shouldBehaveThusly) {
        getDigest('/api/digest/' + uuid, shouldBehaveThusly);
      }
      it('it returns a 200 status code', function(done) {
        get(function(err, res) {
            res.statusCode.should.equal(200);
            done();
        });
      });
    });
  });
});