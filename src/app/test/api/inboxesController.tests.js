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
  eventStoreClient = {
    streams: {
      post: sinon.stub()
    },
    projection: {
      getState: sinon.stub()
    }
  },
  hypermediaResponseStub = {
    inbox: sinon.spy()
  },
  inboxAdded = {
    validate: sinon.stub()
  },
  sanitizer = {
    sanitize: sinon.stub()
  },
  translator = {
    translatePush: sinon.stub()
  },
  controller = proxyquire('../../api/inboxesController',
    {
      './hypermediaResponse': hypermediaResponseStub,
      './sanitizer': sanitizer,
      './events/inboxAdded': inboxAdded,
      './helpers/eventStoreClient': eventStoreClient,
      './translators/githubTranslator': translator
    }
  );

chai.use(sinonChai);
chai.config.includeStack = true;

controller.init(app);

var postInboxCreate = function (payload, shouldBehaveThusly, contentType) {
  if (!contentType) {
    contentType = 'application/json';
  }
  request(app)
    .post('/api/inboxes')
    .send(JSON.stringify(payload))
    .type(contentType)
    .end(shouldBehaveThusly);
};


var postInbox = function (payload, shouldBehaveThusly, contentType, inboxUuid, xGithubEventValue) {
  if (!contentType) {
    contentType = 'application/json';
  }
  request(app)
    .post('/api/inboxes/' + inboxUuid)
    .set('x-github-event', xGithubEventValue || 'push')
    .send(JSON.stringify(payload))
    .type(contentType)
    .end(shouldBehaveThusly);
};

describe('inboxesController', function() {

  describe('when creating an inbox', function() {

    describe('with an unsupported or missing Content-Type header', function() {
      var payload = {};
      it('should reject request and return a 415 status code.', function(done) {
        postInboxCreate(payload, function(err, res) {
          res.statusCode.should.equal(415);
          done();
        }, 'application/jackson');
      });

      it('it should reject the request and explain that only application/json is accepted.', function(done) {
        postInboxCreate(payload, function(err, res) {
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
        inboxAdded.validate.returns([]);
      })

      beforeEach(function() {
        eventStoreClient.streams.post.callsArgWith(1, null, "unused response");
      });

      it('should clean the name field for illegal content', function(done) {
        postInboxCreate(payload, function() {
          sanitizer.sanitize.should.have.been.calledWith('inbox', payload, ['name']);
          done();
        });
      });

      it('should validate the payload against an inboxAdded schema', function(done) {
        postInboxCreate(payload, function() {
          inboxAdded.validate.should.have.been.calledWith(payload);
          done();
        });
      })

      it('it should have a response Content-Type of hal+json', function(done) {
        postInboxCreate(payload, function(err, res) {
          res.get('Content-Type').should.equal('application/hal+json; charset=utf-8');
          done();
        });
      });
    })
  });

  describe('when posting to an inbox', function() {
    var inboxId = 'c347948f-e1d0-4cd7-9341-f0f6ef5289bf';
    var digestId = 'e9be4a71-f6ca-4f02-b431-d74489dee5d0';

    var inboxPayload = {};

    beforeEach(function() {
      eventStoreClient.projection.getState.callsArgWith(1, null, {
        body: JSON.stringify({digestId: digestId}),
        statusCode: 200
      });
    });

    it('it should call the translator with the correct params', function(done) {
      postInbox(inboxPayload, function(err, res) {
        translator.translatePush.should.have.been.calledWith(inboxPayload, digestId)
        done();
      }, null, inboxId)
    })

    it('it should have a response Content-Type of hal+json', function(done) {

      postInbox(inboxPayload, function(err, res) {
        console.log(res.body);
        res.get('Content-Type').should.equal('application/hal+json; charset=utf-8');
        done();
      }, null, inboxId)
    });

    // it('it should have an x-github-event header with a value of push', function(done) {
    //   done();
    // });
  });

  describe('when retrieving information about an inbox', function() {
    it('it should have a response Content-Type of hal+json', function(done) {
      // return false;
      done();
    });
  });

  describe('when posting to an inbox without the x-github-event header', function() {
    it('it should provide an appropriate response', function(done) {

      var postInboxWithoutXGithubEvent = function(shouldBehaveThusly) {
        var inboxId = 'c347948f-e1d0-4cd7-9341-f0f6ef5289bf';
        var digestId = 'e9be4a71-f6ca-4f02-b431-d74489dee5d0';
        var payload = {
          digestId: digestId
        };

        request(app)
        .post('/api/inboxes/' + inboxId)
        .send(JSON.stringify(payload))
        .type('application/json')
        .end(shouldBehaveThusly);
      }

      postInboxWithoutXGithubEvent(function(err, res) {
          res.body.message.should.equal('Unknown event type.');
          done();
        }
      )
    })
  })

});
