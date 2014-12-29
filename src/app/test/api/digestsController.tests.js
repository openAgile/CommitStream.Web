var chai = require('chai'),
  should = chai.should(),
  express = require('express'),
  app = express(),
  chai = require('chai'),
  sinon = require('sinon'),
  sinonChai = require('sinon-chai'),
  _ = require('underscore'),
  request = require('supertest'),
  proxyquire = require('proxyquire'),
  /* We must provide some dummy values here for the module: */
  config = require ('../../config');
  config.eventStorePassword = '123';
  config.eventStoreUser = 'admin',
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
  controller = proxyquire('../../api/digestsController',
    { 
      './hypermediaResponse' : hypermediaResponseStub,
      './events/digestAdded' : digestAdded,
      './helpers/eventStoreClient': eventStoreClient
    }
  );

chai.use(sinonChai);
chai.config.includeStack = true;

controller.init(app);

function postDigest(payload, shouldBehaveThusly, contentType) {
  if (!contentType) {
    contentType = 'application/json';
  }
  request(app)
    .post('/api/digests')
    .send(JSON.stringify(payload))
    .type(contentType)
    .end(shouldBehaveThusly);
};

function getDigest(path, shouldBehaveThusly) {
  request(app)
    .get(path)
    .end(shouldBehaveThusly);
}

describe('digestsController', function () {
    
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
          "self" : { "href": protocol + "://" + host + "/api/digests/" + digestId }
        }
      };

      digestAdded.create.returns(digestAddedEvent);
      hypermediaResponseStub.digestPOST.returns(hypermediaResponse);
    });

    beforeEach(function() {
      eventStoreClient.streams.post.callsArgWith(1, null, "ignored response");
    });

    describe('with an unsupported or missing Content-Type header', function() {
      var data = { description: 'Just your average run-of-the-mill description up in this.' };
      it('should reject request and return a 415 status code.', function(done) {
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
      var data = { description: 'Just your average run-of-the-mill description up in this.' };
      it('should accept the request and return a 201 status code.', function(done) {
        postDigest(data, function(err, res) {
          res.statusCode.should.equal(201);
          done();
        }, 'aPpLiCation/JSON');
      });

    });    

    describe('with a script tag in the description', function() {
      var data = { description: '<script>var x = 123; alert(x);</script>' };
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
      var data = { description: 'Hey there <b>Bold!</b> and <i><u>italicized and underlined</u></i>' };
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
          var data = { description: '' };
          postDigest(data, function(err, res) {
            res.statusCode.should.equal(400);
            done();
          });
        });

        it('it should reject a request and return a meaningful error message.', function(done) {
          var data = { description: '' };
          postDigest(data, function(err, res) {
            res.text.should.equal('A digest description must contain a value.');
            done();
          });
        });
      });

      describe('where description is null as a value', function() {
        it('it should reject a request and return a 400 status code.', function(done) {
          var data = { description: null };
          postDigest(data, function(err, res) {
            res.statusCode.should.equal(400);
            done();
          });
        });

        it('should reject a request and return a meaningful error message.', function(done) {
          var data = { description: null };
          postDigest(data, function(err, res) {
            res.text.should.equal('A digest description must not be null.');
            done();
          });
        });
      });

      describe('where description does not exist in the json payload', function() {
        var data = { notdescription: 'I am not the description property you deserve.' };
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
      var data = { description: Array(142).join('.') };      
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
      postDigest({ description: 'Yay!'}, function(err, res) {
        hypermediaResponseStub.digestPOST.should.have.been.calledWith(protocol, sinon.match.any, digestAddedEvent.data.digestId);
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

    it('it should have a response Content-Type of hal+json', function(done) {
      var digestDescription = { description: 'myfirstdigest' };
      postDigest(digestDescription, function(err, res) {
        res.get('Content-Type').should.equal('application/hal+json; charset=utf-8');
        done();
      });
    });

    it('it should set the Location response header to the newly created digest', function(done) {
      var digestDescription = { description: 'myfirstdigest' };
      postDigest(digestDescription, function(err, res) {
        res.get('Location').should.equal(hypermediaResponse._links.self.href);
        done();
      });
    });

    it('it should have a response code of 201 created', function(done) {
      var digestDescription = { description: 'myfirstdigest' };
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
      var data = { "description": "BalZac!", "digestId": uuid };

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
          res.text.should.equal(JSON.stringify({'error': 'Could not find a digest with id ' + uuid}));
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
          res.text.should.equal(JSON.stringify({'error': 'There was an internal error when trying to process your request'}));
          done();
        });
      });

    });
  });

  describe('when requesting a list of digests', function() {
    
  });

});