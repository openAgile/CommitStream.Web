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
      POST: sinon.stub(),
      uuid: {
        GET: sinon.stub(),
        commits: {
          POST: sinon.stub()
        }
      }
    },

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
  urls = {
    href: sinon.stub()
  },
  controller = proxyquire('../../api/inboxesController', {
    './hypermediaResponse': hypermediaResponseStub,
    './sanitizer': sanitizer,
    './events/inboxAdded': inboxAdded,
    './helpers/eventStoreClient': eventStoreClient,
    './translators/githubTranslator': translator,
    'validator': validator,
    './urls': urls
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
  request(app)
    .post('/api/inboxes')
    .send(JSON.stringify(payload))
    .type(contentType || 'application/json')
    .end(shouldBehaveThusly);
};


var postInbox = function(payload, shouldBehaveThusly, contentType, inboxUuid, xGithubEventValue) {
  var postUrl = '/api/inboxes/' + (inboxUuid || 'c347948f-e1d0-4cd7-9341-f0f6ef5289bf') + '/commits';
  request(app)
    .post(postUrl)
    .set('x-github-event', xGithubEventValue || 'push')
    .send(JSON.stringify(payload))
    .type(contentType || 'application/json')
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
      it('should reject request and return a 415 status code (Unsupported Media Type).', function(done) {
        postInboxCreate(payload, function(err, res) {
          res.statusCode.should.equal(415);
          done();
        }, 'application/jackson');
      });

      it('it should reject the request and explain that only application/json is accepted when sending unsupported Content-Type.', function(done) {
        postInboxCreate(payload, function(err, res) {
          res.text.should.equal('When creating an inbox, you must send a Content-Type: application/json header.');
          done();
        }, 'application/jackson');
      });

      it('it should reject the request and explain that only application/json is accepted when not setting Content-Type', function(done) {
        var postInboxCreateNoContentType = function(payload, shouldBehaveThusly, contentType) {
          request(app)
            .post('/api/inboxes')
            .send(JSON.stringify(payload))
            .end(shouldBehaveThusly);
        };

        postInboxCreateNoContentType(payload, function(err, res) {
          res.text.should.equal('When creating an inbox, you must send a Content-Type: application/json header.');
          done();
        });
      })
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

        eventStoreClient.projection.getState.callsArgWith(1, null, {
          body: JSON.stringify({
            digestId: digestId
          }),
          statusCode: 200
        });

        urls.href = sinon.stub();

        urls.href.returns(function() {});
      });

      it('it should have a response Content-Type of hal+json', function(done) {
        postInboxCreate(payload, function(err, res) {
          res.get('Content-Type').should.equal('application/hal+json; charset=utf-8');
          done();
        });
      });

      it('it should use proper arguments when creating hypermedia.', function(done) {
        postInboxCreate(payload, function(err, res) {
          hypermediaResponseStub.inboxes.POST.should.have.been.calledWith(sinon.match.func, inboxAddedEvent.data.inboxId);
          done();
        });
      });

      it('it should call urls.href once.', function(done) {
        postInboxCreate(payload, function(err, res) {
          urls.href.should.have.been.calledOnce;
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

      describe('but an unsupported Content-Type header', function() {
        it('it should reject the request and explain that only application/json is accepted.', function(done) {
          postInboxCreate(payload, function(err, res) {
            res.text.should.equal('When creating an inbox, you must send a Content-Type: application/json header.');
            done();
          }, 'application/jackson');
        });

        it('should reject request and return a 415 status code (Unsupported Media Type).', function(done) {
          postInboxCreate(payload, function(err, res) {
            res.statusCode.should.equal(415);
            done();
          }, 'application/jackson');
        });
      });

      describe('but with illegal content in the name field', function() {
        before(function() {
          sanitizer.sanitize.returns(['error']);
        })

        it('should call sanitizer.sanitize with correct parameters.', function(done) {
          postInboxCreate(payload, function() {
            sanitizer.sanitize.should.have.been.calledWith('inbox', payload, ['name']);
            done();
          });
        });
      })

      describe('but with a schema violation', function() {
        before(function() {
          sanitizer.sanitize.returns([]);
          inboxAdded.validate.returns(['error']);
        })

        it('should validate the payload against an inboxAdded schema', function(done) {
          postInboxCreate(payload, function() {
            inboxAdded.validate.should.have.been.calledWith(payload);
            done();
          });
        })
      })

      describe('and failures occur when posting to eventstore', function() {

        beforeEach(function() {
          eventStoreClient.streams.post.callsArgWith(1, 'Houston, we have a problem', null);
          sanitizer.sanitize.returns([]);
          inboxAdded.validate.returns([]);
        });

        it('it should send back an appropriate error response', function(done) {
          postInboxCreate(payload, function(err, res) {
            JSON.parse(res.text).errors.should.equal('We had an internal problem. Please retry your request. Error: Houston, we have a problem');
            done();
          });
        });
      });
    });

    describe('for a non-existant digestId', function() {

      var nonExistantDigestId = 'dbb47eec-514c-441d-bb15-b7d6d3d2153c';
      var payload = {
        digestId: nonExistantDigestId
      }

      before(function() {
        eventStoreClient.projection.getState.callsArgWith(1, null, {
          body: {},
          statusCode: 200
        });
        sanitizer.sanitize.returns([]);
        inboxAdded.validate.returns([]);
      })

      it('should reject request and return a 404 status code.', function(done) {
        postInboxCreate(payload, function(err, res) {
          res.statusCode.should.equal(404);
          done();
        });
      });

      it('should call eventStore.projection.getState with the appropriate parameters', function(done) {
        postInboxCreate(payload, function(err, res) {
          eventStoreClient.projection.getState.should.have.been.calledWith({
            name: sinon.match.any,
            partition: 'digest-' + nonExistantDigestId
          }, sinon.match.any);
          done();
        });
      });
    });

    describe('and an error occurs from eventstore when looking up a digest', function() {
      var digestId = 'dbb47eec-514c-441d-bb15-b7d6d3d2153c';
      var payload = {
        digestId: digestId
      }

      before(function() {
        eventStoreClient.projection.getState.callsArgWith(1, 'error', {});
        sanitizer.sanitize.returns([]);
        inboxAdded.validate.returns([]);
      })

      it('a status code of 500 Internal Error should be reported.', function(done) {
        postInboxCreate(payload, function(err, res) {
          res.statusCode.should.equal(500);
          done();
        });
      });

      it('it should send an appropriate error message.', function(done) {
        postInboxCreate(payload, function(err, res) {
          JSON.parse(res.text).error.should.equal('There was an internal error when trying to process your request.');
          done();
        });
      });

      it('it should have an application/json content-type', function(done) {
        postInboxCreate(payload, function(err, res) {
          res.get('Content-Type').should.equal('application/json; charset=utf-8');
          done();
        });
      });
    });

    describe('and santize reports an error', function() {
      before(function() {
        sanitizer.sanitize.returns('Houston, we have a problem');
      });

      it('an appropriate error message is sent', function(done) {
        postInboxCreate(payload, function(err, res) {
          JSON.parse(res.text).errors.should.equal('Houston, we have a problem');
          done();
        });
      });

      it('an appropriate response code is sent', function(done) {
        postInboxCreate(payload, function(err, res) {
          res.statusCode.should.equal(400);
          done();
        });
      });
    });

    describe('and validate reports an error', function() {
      before(function() {
        sanitizer.sanitize.returns([]);
        inboxAdded.validate.returns('Houston, we have a problem.');
      });

      it('an appropriate error message is sent', function(done) {
        postInboxCreate(payload, function(err, res) {
          JSON.parse(res.text).errors.should.equal('Houston, we have a problem.');
          done();
        });
      });
    });
  });

  describe('when posting to an inbox (/api/inboxes/:uuid/commits)', function() {
    var inboxId = 'c347948f-e1d0-4cd7-9341-f0f6ef5289bf';
    var digestId = 'e9be4a71-f6ca-4f02-b431-d74489dee5d0';
    var protocol = 'http';
    var host = 'localhost';

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
      var hypermedia = {
        "_links": {
          "self": {
            "href": protocol + "://" + host + "/api/inboxes/" + inboxId
          },
          "digest-parent": {
            "href": protocol + "://" + host + "/api/digests/" + digestId
          },
          "query-digest": {
            "href": protocol + "://" + host + "/api/query?digestId=" + digestId + "&workitem=all"
          }
        },
        "message": "Your push event has been queued to be added to CommitStream."
      };

      before(function() {
        translator.translatePush.returns(translatorEvent);
        translatorEvent = JSON.stringify(translatorEvent);
        validator.isUUID.returns(true);
        eventStoreClient.streams.post.callsArgWith(1, null, 'Everything is OK.')

        eventStoreClient.projection.getState.callsArgWith(1, null, {
          body: JSON.stringify({
            digestId: digestId
          }),
          statusCode: 200
        });

        hypermediaResponseStub.inboxes.uuid.commits.POST.returns(hypermedia)

      });

      beforeEach(function() {
        urls.href = sinon.stub();
        urls.href.returns(function() {});
      });

      it('it should reject the request and explain that only application/json is accepted when sending unsupported Content-Type.', function(done) {
        postInbox(inboxPayload, function(err, res) {
          res.text.should.equal('When posting to an inbox, you must send a Content-Type: application/json header.');
          done();
        }, 'application/jackson');
      });


      it('it should send back an appropriate created status code of 201', function(done) {
        postInbox(inboxPayload, function(err, res) {
          res.status.should.equal(201);
          done();
        });
      });

      it('it should have a location header set with a place to query for that commit added.', function(done) {
        postInbox(inboxPayload, function(err, res) {
          res.get('Location').should.equal('http://localhost/api/query?digestId=' + digestId + '&workitem=all');
          done();
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

      it('asks for the appropriate hypermedia response', function(done) {
        var hypermediaParams = {
          inboxId: inboxId,
          digestId: digestId
        };

        postInbox(inboxPayload, function(err, res) {
          hypermediaResponseStub.inboxes.uuid.commits.POST.should.have.been.calledWith(sinon.match.func, hypermediaParams);
          done();
        });
      });

      it('it should call urls.href once.', function(done) {
        postInbox(inboxPayload, function(err, res) {
          urls.href.should.have.been.calledOnce;
          done();
        });
      });

      it('it should have an appropriate response message', function(done) {
        postInbox(inboxPayload, function(err, res) {
          var parsedResponse = JSON.parse(res.text);
          parsedResponse.message.should.equal('Your push event has been queued to be added to CommitStream.');
          done();
        }, null, inboxId);
      })

      it('it should have a response Content-Type of hal+json', function(done) {

        postInbox(inboxPayload, function(err, res) {
          res.get('Content-Type').should.equal('application/hal+json; charset=utf-8');
          done();
        }, null, inboxId);
      });

      describe('but with an unrecognized x-github-event-header', function() {
        var eventType = 'unrecognizedEventType';
        it('it should reply with a meaningful message.', function(done) {
          postInbox(inboxPayload, function(err, res) {
            JSON.parse(res.text).message.should.equal('Unknown event type for x-github-event header : ' + eventType);
            done();
          }, null, inboxId, eventType);
        });

        it('it should have a response Content-Type of application/json', function(done) {
          postInbox(inboxPayload, function(err, res) {
            res.get('Content-Type').should.equal('application/json; charset=utf-8');
            done();
          }, null, inboxId, eventType);
        });

        it('it should have a response code of 400 (Bad Request)', function(done) {
          postInbox(inboxPayload, function(err, res) {
            res.status.should.equal(400);
            done();
          }, null, inboxId, eventType);
        });
      })

      describe('but with an x-github-event-header of ping', function() {
        it('it should reply with Pong', function(done) {
          postInbox(inboxPayload, function(err, res) {
            JSON.parse(res.text).message.should.equal('Pong.');
            done();
          }, null, inboxId, 'ping');
        })

        it('it should have a response Content-Type of application/json', function(done) {
          postInbox(inboxPayload, function(err, res) {
            res.get('Content-Type').should.equal('application/json; charset=utf-8');
            done();
          }, null, inboxId, 'ping');
        });

        it('it should have a response code of 200 (OK)', function(done) {
          postInbox(inboxPayload, function(err, res) {
            res.status.should.equal(200);
            done();
          }, null, inboxId, 'ping');
        });
      });

      describe('but without the x-github-event header', function() {
        var postInboxWithoutXGithubEvent = function(shouldBehaveThusly) {
          var inboxId = 'c347948f-e1d0-4cd7-9341-f0f6ef5289bf';
          var digestId = 'e9be4a71-f6ca-4f02-b431-d74489dee5d0';
          var payload = {
            digestId: digestId
          };

          request(app)
            .post('/api/inboxes/' + inboxId + '/commits')
            .send(JSON.stringify(payload))
            .type('application/json')
            .end(shouldBehaveThusly);
        }

        it('it should provide an appropriate response', function(done) {
          postInboxWithoutXGithubEvent(function(err, res) {
            JSON.parse(res.text).errors.should.equal('Unknown event type. Please include an x-github-event header.');
            done();
          });
        });

        it('it should have a response Content-Type of application/json', function(done) {
          postInboxWithoutXGithubEvent(function(err, res) {
            res.get('Content-Type').should.equal('application/json; charset=utf-8');
            done();
          });
        });

        it('it should have a response code of 400 (Bad Request)', function(done) {
          postInboxWithoutXGithubEvent(function(err, res) {
            res.status.should.equal(400);
            done();
          });
        });
      });

      describe('but with an error returned from eventStoreClient.streams.post', function() {
        before(function() {
          eventStoreClient.streams.post.callsArgWith(1, 'Houston, we have a problem.', null);
        });

        it('it should send back an appropriate error response', function(done) {
          postInbox(inboxPayload, function(err, res) {
            JSON.parse(res.text).errors.should.equal('We had an internal problem. Please retry your request. Error: Houston, we have a problem.');
            done();
          }, null, inboxId);
        });

        it('it should have a response Content-Type of application/json', function(done) {
          postInbox(inboxPayload, function(err, res) {
            res.get('Content-Type').should.equal('application/json; charset=utf-8');
            done();
          });
        });

        it('it should send back an appropriate error status code of 500', function(done) {
          postInbox(inboxPayload, function(err, res) {
            res.status.should.equal(500);
            done();
          });
        });
      });

      describe('but with an error returned from getting the digest id', function() {
        before(function() {
          eventStoreClient.projection.getState.callsArgWith(1, 'Houston we have a problem', null);
        })

        it('it should send back an appropriate error status code of 500 (Internal Server Error)', function(done) {
          postInbox(inboxPayload, function(err, res) {
            res.status.should.equal(500);
            done();
          });
        });

        it('it should report the error it received to the client.', function(done) {
          postInbox(inboxPayload, function(err, res) {
            JSON.parse(res.text).message.should.equal('Houston we have a problem');
            done();
          });
        });

        it('it should have a response Content-Type of application/json', function(done) {
          postInbox(inboxPayload, function(err, res) {
            res.get('Content-Type').should.equal('application/json; charset=utf-8');
            done();
          });
        });
      })
    });

    describe('with an invalid inboxId', function() {
      before(function() {
        validator.isUUID.returns(false);
      });

      it('it should respond with a statusCode of 400.', function(done) {
        postInbox(inboxPayload, function(err, res) {
          res.status.should.equal(400);
          done();
        }, null, 'not_a_uuid');
      });

      it('it should respond with a meaningful error message.', function(done) {
        postInbox(inboxPayload, function(err, res) {
          JSON.parse(res.text).message.should.equal('The value not_a_uuid is not recognized as a valid inbox identifier.');
          done();
        }, null, 'not_a_uuid');
      });

      it('it should have a response Content-Type of application/json', function(done) {
        postInbox(inboxPayload, function(err, res) {
          res.get('Content-Type').should.equal('application/json; charset=utf-8');
          done();
        }, null, 'not_a_uuid');
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

      var protocol = 'http';

      var responseFromEventStoreForInbox = {
        digestId: digestId,
        family: 'GitHub',
        name: 'Drive faster than fast',
        url: 'http://github.com/somewhere'
      };

      before(function() {
        validator.isUUID.returns(true);
      })

      beforeEach(function() {
        eventStoreClient.projection.getState.callsArgWith(1, null, {
          body: JSON.stringify(responseFromEventStoreForInbox),
          statusCode: 200
        });

        urls.href = sinon.stub();
        urls.href.returns(function() {});
      });

      function get(shouldBehaveThusly) {
        getInbox('/api/inboxes/' + inboxId, shouldBehaveThusly);
      }

      it('calls eventStore.projection.getState with correct parameters', function(done) {
        get(function(err, res) {
          eventStoreClient.projection.getState.should.have.been.calledWith({
            name: sinon.match.any,
            partition: 'inbox-' + inboxId
          }, sinon.match.func);
          done();
        });
      });

      it('an appropriate hypermedia response is requested', function(done) {
        var hypermediaParams = _.extend({
          inboxId: inboxId
        }, responseFromEventStoreForInbox);

        get(function(err, res) {
          hypermediaResponseStub.inboxes.uuid.GET.should.have.been.calledWith(sinon.match.func, hypermediaParams);
          done();
        });
      });

      it('it should call urls.href once.', function(done) {
        get(function(err, res) {
          urls.href.should.have.been.calledOnce;
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