// test/eventStore.tests.js
var assert = require('assert'),
    proxyquire = require('proxyquire'),
    requestStub = {},
    eventStore = proxyquire('../../../api/helpers/eventStore', { 'request': requestStub });

var es = new eventStore('http://localhost:1234', 'admin', 'changeit');

describe('eventStore', function () {
  describe('pushEvents', function () {
    //mock for the post
    requestStub.post = function (options, callback) {
      var response = {};
      response.headers = options.headers;
      response.body = options.body;
      response.url = options.url;
      
      callback(null, response, response.body);
    };
    
    
    
    it('uses the right url', function (done) {
      es.pushEvents('', function (error, response, body) {
        assert.equal(response.url, 'http://localhost:1234/streams/github-events');
        done();
      });
      
    });
    
    it('has the needed headers', function (done) {
      es.pushEvents('', function (error, response, body) {
        assert.equal(response.headers['Accept'], 'application/json');
        assert.equal(response.headers['Content-Type'], 'application/vnd.eventstore.events+json');
        assert.equal(response.headers['Content-Length'], 0);
        assert.equal(response.headers['Authorization'], 'Basic YWRtaW46Y2hhbmdlaXQ=');
        done();
      });

    });

    //TODO: it throws exception if no events are present?
  });
  
  
  describe('getLastCommit', function () {
    //mock for the get
    requestStub.get = function (options, callback) {
      var response = {};
      response.headers = options.headers;
      response.url = options.url;
      
      callback(null, response, response.body);
    };
    
    it('uses the right url', function (done) {
      es.getLastCommit({ repo: 'somerepo', owner: 'mememe' }, function (error, response, body) {
        assert.equal(response.url, 'http://localhost:1234/streams/repo-mememe-somerepo/head?embed=content');
        done();
      });
    });
    
    it('has the needed headers', function (done) {
      requestStub.get = function (options, callback) {
        var response = {};
        response.headers = options.headers;
        response.url = options.url;
        
        callback(null, response, response.body);
      };
      
      es.getLastCommit({ repo: 'somerepo', owner: 'mememe' }, function (error, response, body) {
        assert.equal(response.headers['Accept'], 'application/json');
        done();
      });
    });
    
    
    it('should return an error if the stream does not exists', function (done) {
      requestStub.get = function (options, callback) {
        var response = {};
        response.statusCode = 404;
        callback(null, response, response.body);
      };
      
      es.getLastCommit({ repo: 'somerepo', owner: 'mememe' }, function (error, response, body) {
        assert.notEqual(error, null);
        assert.equal(body, null);
        done();
      });
      
    });
    
    it('should return no error and a valid body if the stream exists', function (done) {
      requestStub.get = function (options, callback) {
        var response = {};
        response.statusCode = 200;
        response.body = '{ "someBody":"somevalue"}';
        callback(null, response, response.body);
      };
      
      es.getLastCommit({ repo: 'somerepo', owner: 'mememe' }, function (error, response, body) {
        assert.notEqual(body, null);
        assert.equal(error, null);
        done();
      });
    });

  });
});
