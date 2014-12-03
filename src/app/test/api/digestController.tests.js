var chai = require('chai'),
  should = chai.should(),
  validator = require('validator'),
  _ = require('underscore'),
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

postDigest = function(shouldBehaveThusly) {
  request(app)
    .post('/api/digest', 'myfirstdigest')
    .end(shouldBehaveThusly);
};

describe('digestController', function () {
  describe('when creating a digest', function() {
    it('should request digest hypermedia', function(done) {
      postDigest(function(err, res) {
        hypermediaResponseStub.digest.should.have.been.calledOnce;
        done();
      })
    })
  })
