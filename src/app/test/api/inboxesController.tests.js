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
  inboxAdded = {
    validate: sinon.spy()
  },
  sanitizer = {
    sanitize: sinon.stub()
  },
  controller = proxyquire('../../api/inboxesController',
    {
      './hypermediaResponse': hypermediaResponseStub,
      './sanitizer': sanitizer,
      './events/inboxAdded': inboxAdded
    }
  );

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
      var payload = {};
      it('should reject request and return a 415 status code.', function(done) {
        postInbox(payload, function(err, res) {
          res.statusCode.should.equal(415);
          done();
        }, 'application/jackson');
      });

      it('it should reject the request and explain that only application/json is accepted.', function(done) {
        postInbox(payload, function(err, res) {
          res.text.should.equal('When creating an inbox, you must send a Content-Type: application/json header.');
          done();
        }, 'application/jackson');
      });
    });

    describe('with a valid payload', function() {
      var digestId = 'e9be4a71-f6ca-4f02-b431-d74489dee5d0';

      var payload = {
        name: 'His name was Robert Pawlson',
        digestId : digestId,
        family: 'GitHub'
      };

      before(function() {
        sanitizer.sanitize.returns([]);
      })

      it('should clean the name field for illegal content', function(done) {
        postInbox(payload, function() {
          sanitizer.sanitize.should.have.been.calledWith('inbox', payload, ['name']);
          done();
        });
      });

      it('should validate the payload against an inboxAdded schema', function(done) {
        postInbox(payload, function() {
          inboxAdded.validate.should.have.been.calledWith(payload);
          done();
        });
      })
    })
  });
});

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