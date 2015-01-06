// test/queryController.tests.js
var chai = require('chai'),
  should = chai.should(),
  express = require('express'),
  app = express(),
  sinon = require('sinon'),
  sinonChai = require('sinon-chai'),
  _ = require('underscore'),
  request = require('supertest'),
  proxyquire = require('proxyquire').noPreserveCache(),
  /* We must provide some dummy values here for the module: */
  config = require ('../../config');
  config.eventStorePassword = '123';
  config.eventStoreUser = 'admin';
  config.eventStoreBaseUrl = 'http://nothing:7887';

chai.use(sinonChai);
chai.config.includeStack = true;

var eventStoreClient = {
  streams: {
    get: sinon.stub()
  }
}

controller = proxyquire('../../api/queryController', {
  './helpers/eventStoreClient': eventStoreClient
});

controller.init(app);

describe('queryController', function() {
  // describe('when I issue a workitem query for an asset that has no associated commits', function() {
  //   var esStub = function() {
  //     this.streams = {
  //       get: function(args, callback) {
  //         callback(null, {
  //           statusCode: '404',
  //           body: ''
  //         });
  //       }
  //     }
  //   };

  //   controller = proxyquire('../../api/queryController', {
  //     'eventstore-client': esStub
  //   });

  //   controller.init(app);

  //   it('returns a 200 OK response with an empty commits array', function(done) {
  //     //exercise our api
  //     request(app)
  //       .get('/api/query?workitem=123&pageSize=5')
  //       .end(function(err, res) {
  //         should.not.exist(err);
  //         res.statusCode.should.equal(200);
  //         res.body.commits.should.deep.equal([]);
  //         done();
  //       });
  //   });
  // });

  describe('when I issue a query without a workitem as a parameter', function() {

    it('returns a 400 Bad Request response with a error message', function(done) {
      request(app)
        .get('/api/query')
        .end(function(err, res) {
          should.not.exist(err);
          res.statusCode.should.equal(400);
          res.body.error.should.equal('Parameter workitem is required');
          done();
        });
    });
  });

  describe('when I issue a query with a workitem=all as a parameter', function() {
    var mockData = {
      body: '{ "entries": [] }'
    }

    beforeEach(function() {
      eventStoreClient.streams.get.callsArgWith(1, null, mockData);
    })

    it('calls eventstore-client.streams.get asking for the github-events stream and default pageSize', function(done) {
      request(app)
        .get('/api/query?workitem=all')
        .end(function(err, res) {
          eventStoreClient.streams.get.should.have.been.calledWith({
            name: 'github-events',
            count: 5
          }, sinon.match.any);

          done();
        });

    })
  });
});