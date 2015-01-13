var chai = require('chai'),
  should = chai.should(),
  validator = require('validator'),
  _ = require('underscore'),
  express = require('express'),
  app = express(),
  sinon = require("sinon"),
  sinonChai = require("sinon-chai"),
  request = require('supertest'),
  proxyquire = require('proxyquire'),
  hypermediaResponseStub = {
    inbox: sinon.spy()
  },
  controller = proxyquire('../../api/inboxesController', {
    './hypermediaResponse': hypermediaResponseStub
  });

chai.use(sinonChai);
chai.config.includeStack = true;

controller.init(app);

postInbox = function(shouldBehaveThusly) {
  request(app)
    .post('/api/inbox', 'myfirstinbox')
    .end(shouldBehaveThusly);
};

describe('inboxController', function() {
  describe('when creating a inbox', function() {
    it('should request inbox hypermedia', function(done) {
      postInbox(function(err, res) {
        hypermediaResponseStub.inbox.should.have.been.calledOnce;
        done();
      })
    })
  })
})