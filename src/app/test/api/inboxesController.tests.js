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

var postInbox = function (payload, shouldBehaveThusly, contentType) {
  if (!contentType) {
    contentType = 'application/json';
  }
  request(app)
    .post('/api/inboxes')
    .send(JSON.stringify(payload))
    .type(contentType)
    .end(shouldBehaveThusly);
};


describe('inboxesController', function() {
  describe('when creating an inbox', function() {

    describe('with an unsupported or missing Content-Type header', function() {
      var data = { description: 'Just your average run-of-the-mill description up in this.' };
      it('should reject request and return a 415 status code.', function(done) {
        postInbox(data, function(err, res) {
          res.statusCode.should.equal(415);
          done();
        }, 'application/jackson');
      });

      it('it should reject the request and explain that only application/json is accepted.', function(done) {
        postInbox(data, function(err, res) {
          res.text.should.equal('When creating an inbox, you must send a Content-Type: application/json header.');
          done();
        }, 'application/jackson');
      });

    });



  })
})

/*describe('inboxController', function() {
  describe('when creating a inbox', function() {
    it('should request inbox hypermedia', function(done) {
      postInbox(function(err, res) {
        hypermediaResponseStub.inbox.should.have.been.calledOnce;
        done();
      })
    })
  })
})*/