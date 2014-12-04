var chai = require('chai'),
  should = chai.should(),
  express = require('express'),
  app = express(),
  chai = require('chai'),
  sinon = require("sinon"),
  sinonChai = require("sinon-chai"),
  request = require('supertest'),
  proxyquire = require('proxyquire'),
  hypermediaResponseStub = { digest: sinon.spy() },
  controller = proxyquire('../../api/digestController', { './hypermediaResponse' : hypermediaResponseStub });

chai.use(sinonChai);
chai.config.includeStack = true;

controller.init(app);

function postDigest(shouldBehaveThusly) {
  request(app)
    .post('/api/digest', 'myfirstdigest')
    .end(shouldBehaveThusly);
};

function getDigest(path, shouldBehaveThusly) {
  request(app)
    .get(path)
    .end(shouldBehaveThusly);
}

describe('digestController', function () {
  describe('when creating a digest', function() {
    it('should request digest hypermedia', function(done) {
      postDigest(function(err, res) {
        hypermediaResponseStub.digest.should.have.been.calledOnce;
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