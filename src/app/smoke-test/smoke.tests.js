var chai = require('chai'),
  should = chai.should(),
  sinon = require('sinon'),
  sinonChai = require('sinon-chai'),
  _ = require('underscore'),
  request = require('request'),
  uuid = require('uuid-v4'),
  EventStore = require('eventstore-client');

chai.use(sinonChai);
chai.config.includeStack = true;


var commit = {
  "ref": "refs/heads/master",
  "commits": [{
    "id": "d31d174f0495feaf876e92573a2121700fd81e7a",
    "distinct": true,
    "message": "S-11111 Modified!",
    "timestamp": "2014-10-03T15:57:14-03:00",
    "url": "https://github.com/kunzimariano/CommitService.DemoRepo/commit/d31d174f0495feaf876e92573a2121700fd81e7a",
    "author": {
      "name": "kunzimariano",
      "email": "kunzi.mariano@gmail.com",
      "username": "kunzimariano"
    },
    "committer": {
      "name": "kunzimariano",
      "email": "kunzi.mariano@gmail.com",
      "username": "kunzimariano"
    },
    "added": [],
    "removed": [],
    "modified": ["README.md"]
  }],
  "repository": {
    "id": 23355501,
    "name": "CommitService.DemoRepo"
  }
};

describe('api/query before POST', function() {
  it('should return empty commits when request is made with correct key and workitem, but no data yet exists in the system.', function(done) {
    request({
      uri: "http://localhost:6565/api/query?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7&workitem=S-11111",
        method: "GET"
      }, function(err, res, body) {       
      method: "GET"
    }, function(err, res, body) {
        method: "GET"
      }, function(err, res, body) {
      should.not.exist(err);
      res.statusCode.should.equal(200);
      res.body.should.equal('{"commits":[],"_links":{}}');
      done();
    })
  });
});

describe('api/listenerWebhook', function() {
	it('should accept a valid payload and return a 200 OK response.', function(done) {
		request({
	      uri: "http://localhost:6565/api/listenerWebhook?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7",
	      method: "POST",
        headers: {"x-github-event": "push", "content-type": "application/json"},
	      body: JSON.stringify(commit)
	    }, function(err, res, body) {
			should.not.exist(err);
			res.statusCode.should.equal(200);
      res.body.should.equal('{"message":"Your push event has been queued to be added to CommitStream."}')
      done();
    });
  })

	it('should return error message with 401 Unauthorized response when request is made without a key.', function(done){
		request({
			uri: "http://localhost:6565/api/listenerWebhook?workitem=S-11111",
	      method: "POST",
	      body: JSON.stringify(commit)
	    }, function(err, res, body) {
			should.not.exist(err);
			res.statusCode.should.equal(401);
			res.body.should.equal('API key parameter missing or invalid');
			done();
		})
	});

  it('should return error when request is made with incorrect key.', function(done) {
    request({
      uri: "http://localhost:6565/api/listenerWebhook?key=S-11111",
        method: "POST",
        body: JSON.stringify(commit)
      }, function(err, res, body) {
      should.not.exist(err);
      res.statusCode.should.equal(401);
      res.body.should.equal('API key parameter missing or invalid');
      done();
    })
  });
});

// describe('api/query after POST', function() {
//   it('should accept a valid payload and returns commits for the specified workitem.', function(done) {
//     this.timeout(5000);

//     setTimeout(function () {
//       request({
//         uri: "http://localhost:6565/api/query?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7&workitem=S-11111",
//           method: "GET"
//         }, function(err, res, body) {
//         should.not.exist(err);
//         res.statusCode.should.equal(200);
//         res.body.should.equal("{\"commits\":[{\"commitDate\":\"2014-10-03T15:57:14-03:00\",\"timeFormatted\":\"3 months ago\",\"author\":\"kunzimariano\",\"sha1Partial\":\"d31d17\",\"action\":\"committed\",\"message\":\"S-11111 Modified!\",\"commitHref\":\"https://github.com/kunzimariano/CommitService.DemoRepo/commit/d31d174f0495feaf876e92573a2121700fd81e7a\",\"repo\":\"kunzimariano/CommitService.DemoRepo\",\"branch\":\"master\",\"branchHref\":\"https://github.com/kunzimariano/CommitService.DemoRepo/tree/master\",\"repoHref\":\"https://github.com/kunzimariano/CommitService.DemoRepo\"}]}");
//         done();
//       });
//     }, 3000);
//   });

//   it('should return empty commits when request is made with correct key but incorrect workitem.', function(done) {
//     request({
//       uri: "http://localhost:6565/api/query?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7&workitem=11111",
//         method: "GET"
//       }, function(err, res, body) {
//       should.not.exist(err);
//       res.statusCode.should.equal(200);
//       res.body.should.equal('{"commits":[]}');
//       done();
//     })
//   });

//   it('should return error message when request is made with correct key but no workitem.', function(done) {
//     request({
//       uri: "http://localhost:6565/api/query?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7",
//         method: "GET"
//       }, function(err, res, body) {
//       should.not.exist(err);
//       res.statusCode.should.equal(400);
//       res.body.should.equal('{"error":"Parameter workitem is required"}');
//       done();
//     })
//   });

// });

describe('when trying to create an inbox', function() {
  var digestId = undefined;

  describe('you need an digest to associate to the inbox', function() {
    it('create the digest', function(done) {
      request({
        uri: "http://localhost:6565/api/digests?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7",
          method: "POST",
          body: JSON.stringify({description: "Digest 1"})
        }, function(err, res, body) {
        should.not.exist(err);
        res.data.digestId.should.exist;
        digestId = res.data.digestId;
        console.log(digestId);
        done();
      });
    });
  });

  // it('it should get created', function() {
  //   request({
  //     uri: "http://localhost:6565/api/inboxes?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7",
  //       method: "POST"
  //     }, function(err, res, body) {
  //     res.statusCode.should.equal(201);
  //     res.get('Location').should.equal();
  //     res.body.should.equal('{"commits":[]}');
  //     done();
  //   })
  // })

})
