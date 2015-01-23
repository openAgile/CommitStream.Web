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
    inboxes: {
      POST: sinon.stub()
    }
  },
  inboxAdded = {
    validate: sinon.stub(),
    create: sinon.stub()
  },
  sanitizer = {
    sanitize: sinon.stub()
  },
  translator = {
    translatePush: sinon.stub()
  },
  validator = {
    isUUID: sinon.stub()
  },
  controller = proxyquire('../../api/inboxesController', {
    './hypermediaResponse': hypermediaResponseStub,
    './sanitizer': sanitizer,
    './events/inboxAdded': inboxAdded,
    './helpers/eventStoreClient': eventStoreClient,
    './translators/githubTranslator': translator,
    'validator': validator
  });

chai.use(sinonChai);
chai.config.includeStack = true;

controller.init(app);

var getInbox = function(path, shouldBehaveThusly) {
  request(app)
    .get(path)
    .end(shouldBehaveThusly);
}

var postInboxCreate = function(payload, shouldBehaveThusly, contentType) {
  if (!contentType) {
    contentType = 'application/json';
  }
  request(app)
    .post('/api/inboxes')
    .send(JSON.stringify(payload))
    .type(contentType)
    .end(shouldBehaveThusly);
};


var postInbox = function(payload, shouldBehaveThusly, contentType, inboxUuid, xGithubEventValue) {
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

  describe('when creating an inbox (/api/inboxes)', function() {

    var digestId = 'e9be4a71-f6ca-4f02-b431-d74489dee5d0';
    var payload = {
      name: 'His name was Robert Paulson',
      digestId: digestId,
      family: 'GitHub'
    };

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
      var inboxId = '53d8c6ac-37f4-453f-b252-cb2d93c18fa7';

      var protocol = 'http';
      var host = 'localhost';

      var hypermediaResponse = {
        "_links": {
          "self": {
            "href": protocol + "://" + host + "/api/inboxes/" + inboxId
          }
        }
      };

      var inboxAddedEvent = {
        eventType: 'InboxAdded',
        eventId: 'a4cfd6f3-3cb4-4504-ae52-cc8d9fcb8818',
        data: {
          digestId: digestId,
          inboxId: inboxId,
          family: 'GitHub',
          name: 'some name',
          url: 'http://www.someURL.com'
        }
      };

      before(function() {
        sanitizer.sanitize.returns([]);
        inboxAdded.validate.returns([]);
        inboxAdded.create.returns(inboxAddedEvent);
        hypermediaResponseStub.inboxes.POST.returns(hypermediaResponse);
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

      it('it should use proper arguments when creating hypermedia.', function(done) {
        postInboxCreate(payload, function(err, res) {
          hypermediaResponseStub.inboxes.POST.should.have.been.calledWith(protocol, sinon.match.any, inboxAddedEvent.data.inboxId);
          done();
        });
      });

      it('it should have a response code of 201 created', function(done) {
        postInboxCreate(payload, function(err, res) {
          res.status.should.equal(201);
          done();
        });
      });

      it('it should set the Location response header to the newly created digest', function(done) {
        postInboxCreate(payload, function(err, res) {
          res.get('Location').should.equal(hypermediaResponse._links.self.href);
          done();
        });
      });
    });

    describe('and failures occur when posting to eventstore', function() {

      before(function() {
        eventStoreClient.streams.post.callsArgWith(1, 'Houston, we have a problem', null);
      });

      it('it should send back an apprpriate error response', function(done) {
        postInboxCreate(payload, function(err, res) {
          res.body.errors.should.equal('We had an internal problem. Please retry your request. Error: Houston, we have a problem');
          done();
        });
      });
    });

    describe('and santize reports an error', function() {
      before(function() {
        sanitizer.sanitize.returns('Houston, we have a problem');
      });

      it('when santize returns an error it gives an appropriate error message', function(done) {
        postInboxCreate(payload, function(err, res) {
          res.body.errors.should.equal('Houston, we have a problem');
          done();
        });
      });

      it('when santize returns an error it gives an appropriate response code', function(done) {
        postInboxCreate(payload, function(err, res) {
          res.statusCode.should.equal(400);
          done();
        });
      });
    });
  });

  describe('when posting to an inbox (/api/inboxes/:uuid)', function() {
    var inboxId = 'c347948f-e1d0-4cd7-9341-f0f6ef5289bf';
    var digestId = 'e9be4a71-f6ca-4f02-b431-d74489dee5d0';

    var inboxPayload = {};

    var translatorEvent = {
      eventId: 'b0d65208-2afc-43f0-8926-6b20026ab1eb',
      eventType: 'GitHubCommitReceived',
      data: {},
      metadata: {
        digestId: digestId
      }
    };

    describe('with a valid inboxId', function() {

      before(function() {
        translator.translatePush.returns(translatorEvent);
        translatorEvent = JSON.stringify(translatorEvent);
        validator.isUUID.returns(true);
        eventStoreClient.streams.post.callsArgWith(1, null, 'Everything is OK.')
      });

      beforeEach(function() {
        eventStoreClient.projection.getState.callsArgWith(1, null, {
          body: JSON.stringify({
            digestId: digestId
          }),
          statusCode: 200
        });
      });

      it('it should call eventStoreClient to get the Parent DigestId for this inbox', function(done) {
        postInbox(inboxPayload, function(err, res) {
          eventStoreClient.projection.getState.should.have.been.calledWith({
            name: sinon.match.any,
            partition: 'inbox-' + inboxId
          }, sinon.match.any);
          done();
        }, null, inboxId);
      });

      it('should validate the inbox id with the correct params', function(done) {
        postInbox(inboxPayload, function(err, res) {
          validator.isUUID.should.have.been.calledWith(inboxId);
          done();
        }, null, inboxId);
      });

      it('it should call the translator with the correct params', function(done) {
        postInbox(inboxPayload, function(err, res) {
          translator.translatePush.should.have.been.calledWith(inboxPayload, digestId)
          done();
        }, null, inboxId);
      });

      it('it should post to the eventStoreClient with the correct params', function(done) {
        postInbox(inboxPayload, function(err, res) {
          var eventStoreClientParam1 = {
            name: 'inboxCommits-' + inboxId,
            events: translatorEvent
          };
          eventStoreClient.streams.post.should.have.been.calledWith(eventStoreClientParam1, sinon.match.any);
          done();
        });
      });

      it('it should have an appropriate response message', function(done) {
        postInbox(inboxPayload, function(err, res) {
          res.body.message.should.equal('Your push event has been queued to be added to CommitStream.');
          done();
        }, null, inboxId);
      })

      it('it should reply with Pong when passed a x-github-event header of ping', function(done) {
        postInbox(inboxPayload, function(err, res) {
          res.body.message.should.equal('Pong.');
          done();
        }, null, inboxId, 'ping');
      })

      it('it should reply with a meaningful message when passed an unrecognized x-github-event header', function(done) {
        var eventType = 'unrecognizedEventType';
        postInbox(inboxPayload, function(err, res) {
          res.body.message.should.equal('Unknown event type for x-github-event header : ' + eventType);
          done();
        }, null, inboxId, eventType);
      })

      // it('it should have a response Content-Type of hal+json', function(done) {

      //   postInbox(inboxPayload, function(err, res) {
      //     res.get('Content-Type').should.equal('application/hal+json; charset=utf-8');
      //     done();
      //   }, null, inboxId);
      // });

      describe('without the x-github-event header', function() {
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
          });
        });
      });

    });
  });

  describe('when retrieving information about an inbox (/api/inboxes/:uuid)', function() {
    var inboxId = 'c347948f-e1d0-4cd7-9341-f0f6ef5289bf';
    var digestId = 'e9be4a71-f6ca-4f02-b431-d74489dee5d0';

    describe('with an invalid, non-uuid inboxes identifier', function() {

      before(function() {
        validator.isUUID.returns(false);
      })

      function get(shouldBehaveThusly) {
        getInbox('/api/inboxes/not_a_uuid', shouldBehaveThusly);
      }

      it('it returns a 400 status code', function(done) {
        get(function(err, res) {
          res.statusCode.should.equal(400);
          done();
        });
      });

      it('it returns a meaningful error message', function(done) {
        get(function(err, res) {
          res.text.should.equal('The value "not_a_uuid" is not recognized as a valid inbox identifier.');
          done();
        });
      });
    });

    describe('with a valid, uuid inbox identifier', function() {

      before(function() {
        validator.isUUID.returns(true);
      })

      beforeEach(function() {
        eventStoreClient.projection.getState.callsArgWith(1, null, {
          body: JSON.stringify({
            digestId: digestId
          }),
          statusCode: 200
        });
      });

      function get(shouldBehaveThusly) {
        getInbox('/api/inboxes/' + inboxId, shouldBehaveThusly);
      }

      it('calls eventStore.projection.getState with correct parameters', function(done) {
        get(function(err, res) {
          eventStoreClient.projection.getState.should.have.been.calledWith({
            name: sinon.match.any,
            partition: 'inbox-' + inboxId
          }, sinon.match.any);
          done();
        });
      });

      it('it returns a 200 status code', function(done) {
        get(function(err, res) {
          res.statusCode.should.equal(200);
          done();
        });
      });

      it('returns a Content-Type of application/hal+json', function(done) {
        get(function(err, res) {
          res.get('Content-Type').should.equal('application/hal+json; charset=utf-8');
          done();
        });
      });

    });

    describe('with a valid, uuid that does not match a real inbox', function() {

      beforeEach(function() {
        eventStoreClient.projection.getState.callsArgWith(1, null, {
          body: ''
        });
      });

      function get(shouldBehaveThusly) {
        getInbox('/api/inboxes/' + inboxId, shouldBehaveThusly);
      }

      it('calls eventStore.projection.getState with correct parameters', function(done) {
        get(function(err, res) {
          eventStoreClient.projection.getState.should.have.been.calledWith({
            name: sinon.match.any,
            partition: 'inbox-' + inboxId
          }, sinon.match.any);
          done();
        });
      });

      it('it returns a 404 status code', function(done) {
        get(function(err, res) {
          res.statusCode.should.equal(404);
          done();
        });
      });

      it('returns a Content-Type of application/json', function(done) {
        get(function(err, res) {
          res.get('Content-Type').should.equal('application/json; charset=utf-8');
          done();
        });
      });

      it('it returns a meaningful error message', function(done) {
        get(function(err, res) {
          res.text.should.equal(JSON.stringify({
            'error': 'Could not find an inbox with id ' + inboxId
          }));
          done();
        });
      });

    });


    describe('with an error returned from eventStoreClient', function() {

      beforeEach(function() {
        eventStoreClient.projection.getState.callsArgWith(1, 'Hey there is an error!', {});
      });

      function get(shouldBehaveThusly) {
        getInbox('/api/inboxes/' + inboxId, shouldBehaveThusly);
      }

      it('calls eventStore.projection.getState with correct parameters', function(done) {
        get(function(err, res) {
          eventStoreClient.projection.getState.should.have.been.calledWith({
            name: sinon.match.any,
            partition: 'inbox-' + inboxId
          }, sinon.match.any);
          done();
        });
      });

      it('it returns a 500 status code', function(done) {
        get(function(err, res) {
          res.statusCode.should.equal(500);
          done();
        });
      });

      it('returns a Content-Type of application/json', function(done) {
        get(function(err, res) {
          res.get('Content-Type').should.equal('application/json; charset=utf-8');
          done();
        });
      });

      it('it returns a meaningful error message', function(done) {
        get(function(err, res) {
          res.text.should.equal(JSON.stringify({
            'error': 'There was an internal error when trying to process your request'
          }));
          done();
        });
      });

    });

  });


});