var chai = require('chai'),
  should = chai.should(),
  express = require('express'),
  app = express(),
  sinon = require('sinon'),
  sinonChai = require('sinon-chai'),
  _ = require('underscore'),
  request = require('supertest'),
  proxyquire = require('proxyquire').noPreserveCache();
/* We must provide some dummy values here for the module: */
config = require('../../config');
config.eventStorePassword = '123';
config.eventStoreUser = 'admin';
config.eventStoreBaseUrl = 'http://nothing:7887';

var hypermediaResponseStub = {
    digestPOST: sinon.stub(),
    digestGET: sinon.stub()
  },
  digestAdded = {
    create: sinon.stub()
  },
  eventStoreClient = {
    streams: {
      post: sinon.stub()
    },
    projection: {
      getState: sinon.stub()
    }
  },
  controller = proxyquire('../../api/digestsController', {
    './hypermediaResponse': hypermediaResponseStub,
    './events/digestAdded': digestAdded,
    './helpers/eventStoreClient': eventStoreClient
  });

chai.use(sinonChai);
chai.config.includeStack = true;

controller.init(app);

var postDigest = function(payload, shouldBehaveThusly, contentType) {
  if (!contentType) {
    contentType = 'application/json';
  }
  request(app)
    .post('/api/digests')
    .send(JSON.stringify(payload))
    .type(contentType)
    .end(shouldBehaveThusly);
};

var getDigest = function(path, shouldBehaveThusly) {
  var superTest = request(app);
  superTest
    .get(path)
    .end(shouldBehaveThusly);
}

describe('digestsController', function() {

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
          "self": {
            "href": protocol + "://" + host + "/api/digests/" + digestId
          }
        }
      };

      digestAdded.create.returns(digestAddedEvent);
      hypermediaResponseStub.digestPOST.returns(hypermediaResponse);
    });

    beforeEach(function() {
      eventStoreClient.streams.post.callsArgWith(1, null, "ignored response");
    });

    describe('with an unsupported or missing Content-Type header', function() {
      var data = {
        description: 'Just your average run-of-the-mill description up in this.'
      };
      it('should reject request and return a 415 status code (Unsupported Media Type).', function(done) {
        postDigest(data, function(err, res) {
          res.statusCode.should.equal(415);
          done();
        }, 'application/jackson');
      });

      it('it should reject the request and explain that only application/json is accepted.', function(done) {
        postDigest(data, function(err, res) {
          res.text.should.equal('When creating a digest, you must send a Content-Type: application/json header.');
          done();
        }, 'application/jackson');
      });

    });

    describe('with a Content-Type: aPpLiCation/JSON (weird case) header', function() {
      var data = {
        description: 'Just your average run-of-the-mill description up in this.'
      };
      it('should accept the request and return a 201 status code.', function(done) {
        postDigest(data, function(err, res) {
          res.statusCode.should.equal(201);
          done();
        }, 'aPpLiCation/JSON');
      });

    });

    describe('with a script tag in the description', function() {
      var data = {
        description: '<script>var x = 123; alert(x);</script>'
      };
      it('it should reject the request and return a 400 status code.', function(done) {
        postDigest(data, function(err, res) {
          res.statusCode.should.equal(400);
          done();
        });
      });

      it('it should reject the request and return a meaningful error message.', function(done) {
        postDigest(data, function(err, res) {
          res.text.should.equal('A digest description cannot contain script tags or HTML.');
          done();
        });
      });
    });

    describe('with HTML tags in the description', function() {
      var data = {
        description: 'Hey there <b>Bold!</b> and <i><u>italicized and underlined</u></i>'
      };
      it('it should reject the request request and return a 400 status code.', function(done) {
        postDigest(data, function(err, res) {
          res.statusCode.should.equal(400);
          done();
        });
      });

      it('it should reject a request and return a meaningful error message.', function(done) {
        postDigest(data, function(err, res) {
          res.text.should.equal('A digest description cannot contain script tags or HTML.');
          done();
        });
      });
    });

    describe('with a zero length description', function() {

      describe('where description is an empty string', function() {
        it('it should reject a request and return a 400 status code.', function(done) {
          var data = {
            description: ''
          };
          postDigest(data, function(err, res) {
            res.statusCode.should.equal(400);
            done();
          });
        });

        it('it should reject a request and return a meaningful error message.', function(done) {
          var data = {
            description: ''
          };
          postDigest(data, function(err, res) {
            res.text.should.equal('A digest description must contain a value.');
            done();
          });
        });
      });

      describe('where description is null as a value', function() {
        it('it should reject a request and return a 400 status code.', function(done) {
          var data = {
            description: null
          };
          postDigest(data, function(err, res) {
            res.statusCode.should.equal(400);
            done();
          });
        });

        it('should reject a request and return a meaningful error message.', function(done) {
          var data = {
            description: null
          };
          postDigest(data, function(err, res) {
            res.text.should.equal('A digest description must not be null.');
            done();
          });
        });
      });

      describe('where description does not exist in the json payload', function() {
        var data = {
          notdescription: 'I am not the description property you deserve.'
        };
        it('should reject a request and return a 400 status code.', function(done) {
          postDigest(data, function(err, res) {
            res.statusCode.should.equal(400);
            done();
          });
        });

        it('should reject a request and return a meaningful error message.', function(done) {
          postDigest(data, function(err, res) {
            res.text.should.equal('A digest must contain a description.');
            done();
          });
        });

      });

    });

    describe('with a description greater than 140 characters', function() {
      var data = {
        description: Array(142).join('.')
      };
      it('it should reject a request and return a 400 status code.', function(done) {
        postDigest(data, function(err, res) {
          res.statusCode.should.equal(400);
          done();
        });
      });

      it('it should reject a request and return a meaningful error message.', function(done) {
        postDigest(data, function(err, res) {
          res.text.should.equal('A digest description cannot contain more than 140 characters. The description you submitted contains 141 characters.');
          done();
        });
      });

    });

    it('it should use proper arguments when creating hypermedia.', function(done) {
      postDigest({
        description: 'Yay!'
      }, function(err, res) {
        hypermediaResponseStub.digestPOST.should.have.been.calledWith(protocol, sinon.match.any, digestAddedEvent.data.digestId);
        done();
      });
    });

    it('it should create the DigestAdded event.', function(done) {
      var digestDescription = {
        description: 'myfirstdigest'
      };
      postDigest(digestDescription, function(err, res) {
        digestAdded.create.should.have.been.calledWith(digestDescription.description);
        done();
      });
    });

    it('it should have a response Content-Type of hal+json', function(done) {
      var digestDescription = {
        description: 'myfirstdigest'
      };
      postDigest(digestDescription, function(err, res) {
        res.get('Content-Type').should.equal('application/hal+json; charset=utf-8');
        done();
      });
    });

    it('it should set the Location response header to the newly created digest', function(done) {
      var digestDescription = {
        description: 'myfirstdigest'
      };
      postDigest(digestDescription, function(err, res) {
        res.get('Location').should.equal(hypermediaResponse._links.self.href);
        done();
      });
    });

    it('it should have a response code of 201 created', function(done) {
      var digestDescription = {
        description: 'myfirstdigest'
      };
      postDigest(digestDescription, function(err, res) {
        res.status.should.equal(201);
        done();
      });
    });

  });

  /********************************************

   GET tests

   *******************************************/

  describe('when requesting a digest', function() {

    var protocol = 'http';
    var host = 'localhost';

    describe('with an invalid, non-uuid digest identifier', function() {
      function get(shouldBehaveThusly) {
        getDigest('/api/digests/not_a_uuid', shouldBehaveThusly);
      }

      it('it returns a 400 status code', function(done) {
        get(function(err, res) {
          res.statusCode.should.equal(400);
          done();
        });
      });

      it('it returns a meaningful error message', function(done) {
        get(function(err, res) {
          res.text.should.equal('The value "not_a_uuid" is not recognized as a valid digest identifier.');
          done();
        });
      });
    });

    describe('with a valid, uuid digest identifier', function() {

      var uuid = 'e9be4a71-f6ca-4f02-b431-d74489dee5d0';
      var data = {
        "description": "BalZac!",
        "digestId": uuid
      };

      beforeEach(function() {
        hypermediaResponseStub.digestGET = sinon.stub();
        eventStoreClient.projection.getState = sinon.stub();
        eventStoreClient.streams.post = sinon.stub();
        eventStoreClient.projection.getState.callsArgWith(1, null, {
          body: JSON.stringify(data)
        });
      });

      function get(shouldBehaveThusly) {
        getDigest('/api/digests/' + uuid, shouldBehaveThusly);
      }

      it('calls eventStore.projection.getState with correct parameters', function(done) {
        get(function(err, res) {
          eventStoreClient.projection.getState.should.have.been.calledWith({
            name: sinon.match.any,
            partition: 'digest-' + uuid
          }, sinon.match.any);
          done();
        });
      });

      it('calls hypermediaResponse.digestPOST with correct parameters', function(done) {
        get(function(err, res) {
          hypermediaResponseStub.digestGET.should.have.been.calledWith(
            protocol, sinon.match.any, uuid, data
          );
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

    describe('with a valid, uuid that does not match a real digest', function() {

      beforeEach(function() {
        eventStoreClient.projection.getState = sinon.stub();
        eventStoreClient.streams.post = sinon.stub();
        eventStoreClient.projection.getState.callsArgWith(1, null, {
          body: ''
        }); // No error, but nothing found on the remote end
      });

      var uuid = 'ba9f6ac9-fe4a-4ddd-bf07-f1fb37be5dbf';

      function get(shouldBehaveThusly) {
        getDigest('/api/digests/' + uuid, shouldBehaveThusly);
      }

      it('calls eventStore.projection.getState with correct parameters', function(done) {
        get(function(err, res) {
          eventStoreClient.projection.getState.should.have.been.calledWith({
            name: sinon.match.any,
            partition: 'digest-' + uuid
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
            'error': 'Could not find a digest with id ' + uuid
          }));
          done();
        });
      });

    });

    describe('with an error returned from eventStoreClient', function() {

      beforeEach(function() {
        eventStoreClient.projection.getState = sinon.stub();
        eventStoreClient.streams.post = sinon.stub();
        eventStoreClient.projection.getState.callsArgWith(1, 'Hey there is an error!', {});
      });

      var uuid = '4cc217e4-0802-4f0f-8218-f8e5772aac5b';

      function get(shouldBehaveThusly) {
        getDigest('/api/digests/' + uuid, shouldBehaveThusly);
      }

      it('calls eventStore.projection.getState with correct parameters', function(done) {
        get(function(err, res) {
          eventStoreClient.projection.getState.should.have.been.calledWith({
            name: sinon.match.any,
            partition: 'digest-' + uuid
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

  describe('/api/digests/<digestId>/inboxes -- when requesting inboxes for a given digest', function() {

    var digestId,
        err,
        res,
        digest;

    function reset() {
      digestId = 'ba9f6ac9-fe4a-4ddd-bf07-f1fb37be5dbf',
      err,
      res,
      digest = {
        digestId: digestId,
        description: 'Digest with Inboxes'
      };
      eventStoreClient.projection.getState = sinon.stub();
    }    

    function get(done, _digestId) {
      if (_digestId === undefined) _digestId = digestId;
      getDigest('/api/digests/' + _digestId + '/inboxes', function(_err, _res) {        
        err = _err;
        res = _res;
        done();
      });
    }

    function normalizeHrefs(text) {
      var rx = /http:\/\/127\.0\.0\.1\:\d+/g;
      return text.replace(rx, '');
    }

    describe('with an invalid, non-uuid digest identifier it', function() {
      before(function(done) {
        reset();
        get(done, 'not_a_uuid');
      });

      it('returns a 400 status code', function() {
        res.statusCode.should.equal(400);
      });

      it('returns a meaningful error message', function() {
        res.text.should.equal('The value "not_a_uuid" is not recognized as a valid digest identifier.');
      });
    });

    describe('when digest projection returns an error it', function() {
      before(function(done) {
        reset(); 
        eventStoreClient.projection.getState.onFirstCall().callsArgWith(1, 'blow up!', null);
        get(done);
      });

      it('returns a 500 status code', function() {
        res.statusCode.should.equal(500);
      });

      it('returns a meaningful error message', function() {
        res.text.should.equal(JSON.stringify({'error':'There was an internal error when trying to process your request.'}));
      });
    });

    describe('when inboxes-for-digest projection returns an error it', function() {

      before(function(done) {
        reset();
        eventStoreClient.projection.getState.onFirstCall().callsArgWith(1, null, {
          body: JSON.stringify(digest)
        });        
        eventStoreClient.projection.getState.onSecondCall().callsArgWith(1, 'blow up!', null);
        get(done);
      });

      it('calls eventStore.projection.getState to find the digest', function() {
        eventStoreClient.projection.getState.firstCall.should.have.been.calledWith({
          name: 'digest',
          partition: 'digest-' + digestId
        }, sinon.match.func);
      });

      it('calls eventStore.projection.getState to get the inboxes', function() {
        eventStoreClient.projection.getState.secondCall.should.have.been.calledWith({
          name: 'inboxes-for-digest',
          partition: 'digestInbox-' + digestId
        }, sinon.match.func);
      });

      it('returns a 500 status code', function() {
        res.statusCode.should.equal(500);
      });

      it('returns a meaningful error message', function() {
        res.text.should.equal(JSON.stringify({'error':'There was an internal error when trying to process your request.'}));
      });

    });

    describe('when inboxes-for-digest projection returns an empty result it', function() {
      var expected;

      before(function(done) {
        reset();
        eventStoreClient.projection.getState.onFirstCall().callsArgWith(1, null, {
          body: JSON.stringify(digest)
        });        
        eventStoreClient.projection.getState.onSecondCall().callsArgWith(1, null, {
          body: ''
        });
        expected = {
          "_links": {
            "self": {
              "href": "/api/digests/" + digestId + "/inboxes",
            },
            "digest": {
              "href": "/api/digests/" + digestId
            },
            "inbox-create": {
              "href": "/api/inboxes",
              "method": "POST",
              "title": "Endpoint for creating an inbox for a repository on digest " + digestId + "."
            }
          },
          "count": 0,
          "digest": {
            "digestId": digestId,
            "description": digest.description
          },
          "_embedded": {
            "inboxes": []
          }
        };        
        get(done);
      });

      it('calls eventStore.projection.getState to find the digest', function() {
        eventStoreClient.projection.getState.firstCall.should.have.been.calledWith({
          name: 'digest',
          partition: 'digest-' + digestId
        }, sinon.match.func);
      });

      it('calls eventStore.projection.getState to get the inboxes', function() {
        eventStoreClient.projection.getState.secondCall.should.have.been.calledWith({
          name: 'inboxes-for-digest',
          partition: 'digestInbox-' + digestId
        }, sinon.match.func);
      });

      it('returns a 200 status code', function() {
        res.statusCode.should.equal(200);
      });

      it('returns Content-Type hal+json', function() {
        res.get('Content-Type').should.equal('application/hal+json; charset=utf-8');
      });

      it('returns a HAL formatted response with no inboxes', function() {
        var body = normalizeHrefs(res.text)
        JSON.parse(body).should.deep.equal(expected);        
      });
    });

    describe('when inboxes-for-digest projection returns a valid state', function() {
      var inbox1Id = '4e045ad2-0c62-410e-a39d-bd5e85a5f059';
      var inbox2Id = '2aa7c387-f7f5-407e-b43e-06e8d3da6d71'
      var inbox1Name = 'Hey hey inbox';
      var inbox2Name = 'Yo yo inbox';

      before(function(done) {
        reset();
        var state = {
          'inboxes': {}
        };

        state.inboxes[inbox1Id] = {
          inboxId: inbox1Id,
          name: inbox1Name,
          family: 'GitHub',
          digestId: digestId
        };

        state.inboxes[inbox2Id] = {
          inboxId: inbox2Id,
          name: inbox2Name,
          family: 'GitHub',
          digestId: digestId
        };

        eventStoreClient.projection.getState = sinon.stub();
        eventStoreClient.projection.getState.onFirstCall().callsArgWith(1, null, {
          body: JSON.stringify(digest)
        });
        eventStoreClient.projection.getState.onSecondCall().callsArgWith(1, null, {
          body: JSON.stringify(state)
        });
        get(done);
      });

      it('calls eventStore.projection.getState to find the digest', function() {
        eventStoreClient.projection.getState.firstCall.should.have.been.calledWith({
          name: 'digest',
          partition: 'digest-' + digestId
        }, sinon.match.any);
      });

      it('calls eventStore.projection.getState to get the inboxes', function() {
        eventStoreClient.projection.getState.secondCall.should.have.been.calledWith({
          name: 'inboxes-for-digest',
          partition: 'digestInbox-' + digestId
        }, sinon.match.any);
      });

      it('returns a 200 status code', function() {
        res.statusCode.should.equal(200);
      });

      it('returns Content-Type hal+json', function() {
        res.get('Content-Type').should.equal('application/hal+json; charset=utf-8');
      });

      it('returns a HAL formatted response', function() {
        var expected = {
          "_links": {
            "self": {
              "href": "/api/digests/" + digestId + "/inboxes",
            },
            "digest": {
              "href": "/api/digests/" + digestId
            },
            "inbox-create": {
              "href": "/api/inboxes",
              "method": "POST",
              "title": "Endpoint for creating an inbox for a repository on digest " + digestId + "."
            }
          },
          "count": 2,
          "digest": {
            "digestId": digestId,
            "description": digest.description
          },
          "_embedded": {
            "inboxes": [{
              "_links": {
                "self": {
                  "href": "/api/inboxes/" + inbox1Id
                },
                "inbox-commits": {
                  "href": "/api/inboxes/" + inbox1Id + "/commits",
                  "method": "POST"
                }
              },
              "inboxId": inbox1Id,
              "family": "GitHub",
              "name": "Hey hey inbox"
            }, {
              "_links": {
                "self": {
                  "href": "/api/inboxes/" + inbox2Id
                },
                "inbox-commits": {
                  "href": "/api/inboxes/" + inbox2Id + "/commits",
                  "method": "POST"
                }
              },
              "inboxId": inbox2Id,
              "family": "GitHub",
              "name": "Yo yo inbox"
            }]
          }
        };        
        var body = normalizeHrefs(res.text);
        JSON.parse(body).should.deep.equal(expected);
      });
    });
  });
});