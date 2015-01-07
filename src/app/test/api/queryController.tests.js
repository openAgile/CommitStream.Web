// test/queryController.tests.js
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
};

var controller = proxyquire('../../api/queryController', {
  './helpers/eventStoreClient': eventStoreClient
});

controller.init(app);

describe('queryController', function() {
  var defaultPageSize = 5;

  describe('when I issue a workitem query for an asset that has no associated commits', function() {
    var mockData = {
      body: '',
      statusCode: '404'
    };

    beforeEach(function() {
      eventStoreClient.streams.get = sinon.stub();
      eventStoreClient.streams.get.callsArgWith(1, null, mockData);
    });

    it('returns a 200 OK response with an empty commits array', function(done) {
      //exercise our api
      request(app)
        .get('/api/query?workitem=123&pageSize=5')
        .end(function(err, res) {
          should.not.exist(err);
          res.statusCode.should.equal(200);
          res.body.commits.should.deep.equal([]);
          done();
        });
    });
  });

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

  describe('when I issue a query with a workitem=all as a parameter for default pageSize', function() {
    var mockData = {
      body: '{ "entries": [] }'
    };

    beforeEach(function() {
      eventStoreClient.streams.get = sinon.stub();
      eventStoreClient.streams.get.callsArgWith(1, null, mockData);
    });

    it('calls eventstore-client.streams.get asking for the github-events stream and pageSize of 5', function(done) {
      request(app)
        .get('/api/query?workitem=all')
        .end(function(err, res) {
          eventStoreClient.streams.get.should.have.been.calledWith({
            name: 'github-events',
            count: 5
          }, sinon.match.any);

          done();
        });
    });
  });

  describe('when I issue a query for an asset for default pageSize', function() {
    var assetId = 'S-83940';

    beforeEach(function() {
      eventStoreClient.streams.get = sinon.stub();
      eventStoreClient.streams.get.callsArgWith(1, null, {});
    });

    it('calls eventstore-client.streams.get asking for a asset-' + assetId + ' stream and pageSize of 5', function(done) {
      request(app)
        .get('/api/query?workitem=' + assetId)
        .end(function(err, res) {
          eventStoreClient.streams.get.should.have.been.calledWith({
            name: 'asset-' + assetId,
            count: 5
          }, sinon.match.any);

          done();
        });
    });
  });

  describe('when I issue a query for an asset for non-default pageSize', function() {
    var assetId = 'S-83940';

    beforeEach(function() {
      eventStoreClient.streams.get = sinon.stub();
      eventStoreClient.streams.get.callsArgWith(1, null, {});
    });

    it('of 10, it calls eventstore-client.streams.get asking for a asset-' + assetId + ' stream and pageSize of 10', function(done) {
      var pageSize=10;

      request(app)
        .get('/api/query?workitem=' + assetId + '&pageSize=' + pageSize)
        .end(function(err, res) {
          eventStoreClient.streams.get.should.have.been.calledWith({
            name: 'asset-' + assetId,
            count: 10
          }, sinon.match.any);

          done();
        });
    });

    describe('giving a non-numeric value', function() {

      beforeEach(function() {
        eventStoreClient.streams.get = sinon.stub();
        eventStoreClient.streams.get.callsArgWith(1, null, {});
      });

      var nonNumericValue = '12ForYou';

      it('it uses the default pageSize of ' + defaultPageSize + ' when passing the request to the event store client', function(done) {
        request(app)
          .get('/api/query?workitem=' + assetId + '&pageSize=' + nonNumericValue)
          .end(function(err, res) {
            eventStoreClient.streams.get.should.have.been.calledWith({
              name: 'asset-' + assetId,
              count: defaultPageSize
            }, sinon.match.any);

            done();
          });
      });
    });
  });

});