var chai = require('chai'),
  should = chai.should(),
  express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  chai = require('chai'),
  sinon = require("sinon"),
  sinonChai = require("sinon-chai"),
  request = require('supertest'),
  proxyquire = require('proxyquire'),
  hypermediaResponseStub = { digestPOST: sinon.spy() },
  digestAdded = { create: sinon.stub() },
  controller = proxyquire('../../api/digestController',
      { './hypermediaResponse' : hypermediaResponseStub,
        './events/digestAdded' : digestAdded
      }
    );

app.use(bodyParser.json());

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
    var digestAddedEvent = {
      eventType: 'DigestAdded',
      eventId: '87b66de8-8307-4e03-b2d3-da447c66501a',
      digestId: '7f74aa58-74e0-11e4-b116-123b93f75cba',
      description: 'my first digest'
    };

    digestAdded.create.returns(digestAddedEvent);

    it('it should receive digest hypermedia as a response.', function(done) {
      postDigest({}, function(err, res) {
        hypermediaResponseStub.digestPOST.should.have.been.calledOnce;
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