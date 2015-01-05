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

chai.use(sinonChai);
chai.config.includeStack = true;

describe('queryController', function() {
  describe('when I issue a workitem query for an asset that has no associated commits', function() {
    var esStub = function() {
      this.streams = {
        get: function(args, callback) {
          callback(null, {
            statusCode: '404',
            body: ''
          });
        }
      }
    };

    controller = proxyquire('../../api/queryController', {
      'eventstore-client': esStub
    });

    controller.init(app);

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
    controller = proxyquire('../../api/queryController', {
      'eventstore-client': {}
    });

    controller.init(app);

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
});