// test/queryController.tests.js
var assert = require('assert'),
    express = require('express'),
    app = express(),
    request = require('supertest'),
    proxyquire = require('proxyquire'),
    eventStoreStub = {},
    controller = proxyquire('../../api/queryController', { 'eventStore': eventStoreStub });

controller.init(app);

describe('queryController', function() {
    describe('when I issue a workitem query for an asset that has no associated commits', function() {
        eventStoreStub.getLastAssets = function(args, callback) {
            callback(null, undefined);
        };

        it('returns a 200 OK response with an empty commits array', function(done) {
            //exercise our api
            request(app)
                .get('/api/query?workitem=123&pageSize=5')
                .end(function(err, res) {
                    assert.equal(err, null);
                    assert.equal(res.statusCode, 200);
                    assert.deepEqual(res.body.commits, []);
                    done();
                });
        });
    });
    describe('when I issue a query without a workitem as a parameter', function () {       
        it('returns a 400 Bad Request response with a error message', function (done){
            request(app)
            .get('/api/query')
            .end(function (err, res) {
                    assert.equal(err, null);
                    assert.equal(res.statusCode, 400);
                    assert.equal(res.body.error, 'Parameter workitem is required');
                    done();
            });
        });
    });
});