// test/queryController.tests.js
var assert = require('assert'),
    express = require('express'),
    app = express(),
    request = require('supertest'),
    controller = require('../../api/queryController');

controller.init(app);

describe('queryController', function () {
    describe('when I issue a workitem query for an asset that has no associated commits', function () {
        var nock = require('nock');
        //mock requests to event store
        var scope = nock('http://localhost:2113')
        .get('/streams/asset-123/head/backward/5?embed=content')
        .reply(404);
        
        it('returns a 200 OK response with an empty commits array', function (done) {
            //exercise our api
            request(app)
            .get('/api/query?workitem=123&pageSize=5')
            .end(function (err, res) {
                assert.equal(err, null);
                assert.equal(res.statusCode, 200);
                assert.deepEqual(res.body.commits, []);
                done();
            });
        });
    });
});