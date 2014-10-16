// test/queryController.tests.js

var assert = require("assert"),
    express = require('express'),
    app = express(),
    request = require('request-json'),
    controller = require('../queryController');


var port = 6667;
var baseUrl = "http://localhost:" + port;
var workItem = '123';

describe('queryController', function () {
    before(function (done) {
        controller.init(app);
        app.listen(port, function () {
            //console.log('CommitStream Web Server listening on port ' + port);
            done();

        });
    });
    
    
    describe('When I issue a workitem query for an asset that has no associated commits', function () {
        var nock = require('nock');
        var scope = nock('http://localhost:2113')
        .get('/streams/asset-123/head/backward/5?embed=content')
        .reply(404);
        
        
        it('returns a 200 OK response with an empty commits array', function (done) {
            var client = request.newClient(baseUrl);
            client.get("/api/query?workitem=123", function (e, r, body) {
                assert.equal(r.statusCode, 200);
                assert.deepEqual(body.commits, []);
                done();
            });
        });
    });
    
});