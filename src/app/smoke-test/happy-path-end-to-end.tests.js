var chai = require('chai'),
  should = chai.should(),
  sinon = require('sinon'),
  sinonChai = require('sinon-chai'),
  _ = require('underscore'),
  request = require('request');

chai.use(sinonChai);
chai.config.includeStack = true;


var commitInbox1 = {
  "ref": "refs/heads/master",
  "commits": [{
    "id": "d31d174f0495feaf876e92573a2121700fd81e7a",
    "distinct": true,
    "message": "S-11111 initial Commit to backend functionality!",
    "timestamp": "2014-10-03T15:57:14-03:00",
    "url": "https://github.com/kunzimariano/CommitService.DemoRepo/commit/d31d174f0495feaf876e92573a2121700fd81e7a",
    "author": {
      "name": "laureanoremedi",
      "email": "laureanoremedi@gmail.com",
      "username": "laureanoremedi"
    },
    "committer": {
      "name": "laureanoremedi",
      "email": "laureanoremedi@gmail.com",
      "username": "laureanoremedi"
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

var commitInbox2 = {
  "ref": "refs/heads/master",
  "commits": [{
    "id": "d31d174f0495feaf876e92573a2121700fd81e7a",
    "distinct": true,
    "message": "S-11111 Modified UI validations!",
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

var commitInbox2WithOutMention = {
  "ref": "refs/heads/master",
  "commits": [{
    "id": "d31d174f0495feaf876e92573a2121700fd81e7a",
    "distinct": true,
    "message": "Actualize Documentation",
    "timestamp": "2014-10-03T15:57:14-03:00",
    "url": "https://github.com/kunzimariano/CommitService.DemoRepo/commit/d31d174f0495feaf876e92573a2121700fd81e7a",
    "author": {
      "name": "matiasHeffel",
      "email": "matiasheffel@gmail.com",
      "username": "kunzimariano"
    },
    "committer": {
      "name": "matiasHeffel",
      "email": "matiasHeffel@gmail.com",
      "username": "matiasHeffel"
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

var digestId = undefined;
var inbox1 = undefined;
var inbox2 = undefined;

describe('you need an digest to associate to the inboxes that it will be created', function() {
  it('create the digest', function(done) {
    request({
      uri: "http://localhost:6565/api/digests?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7",
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        description: "Digest 1"
      })
    }, function(err, res, body) {
      should.not.exist(err);
      var digestIdCreated = JSON.parse(body).digestId;
      digestIdCreated.should.exist;
      digestId = digestIdCreated;
      done();
    });
  });
  it('create the inbox and associate to the digest created', function(done) {
    request({
      uri: "http://localhost:6565/api/inboxes?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7",
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        name: "Inbox 1",
        digestId: digestId,
        family: "GitHub"
      })
    }, function(err, res, body) {
      should.not.exist(err);
      var inboxIdCreated = JSON.parse(body).inboxId;
      inboxIdCreated.should.exist;
      inbox1 = inboxIdCreated;
      done();
    });
  });
  it('create a different inbox and associate to the same digest created', function(done) {
    request({
      uri: "http://localhost:6565/api/inboxes?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7",
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        name: "Inbox 2",
        digestId: digestId,
        family: "GitHub"
      })
    }, function(err, res, body) {
      should.not.exist(err);
      var inboxIdCreated = JSON.parse(body).inboxId;
      inboxIdCreated.should.exist;
      inbox2 = inboxIdCreated;
      done();
    });
  });
});

describe('api/query before POST', function() {
  it('should return empty commits when request is made with correct key and workitem, but no data yet exists in the system.', function(done) {
    request({
      uri: "http://localhost:6565/api/query?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7&digestId=" + digestId + "&workitem=S-11111",
      method: "GET"
    }, function(err, res, body) {
      should.not.exist(err);
      res.statusCode.should.equal(200);
      res.body.should.equal('{"commits":[]}');
      done();
    })
  });
});

describe('api/inboxes', function() {
  it('should accept a valid payload and return a 200 OK response.', function(done) {
    request({
      uri: "http://localhost:6565/api/inboxes/" + inbox1 + "?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7",
      method: "POST",
      headers: {
        "x-github-event": "push",
        "content-type": "application/json"
      },
      body: JSON.stringify(commitInbox1)
    }, function(err, res, body) {
      should.not.exist(err);
      res.statusCode.should.equal(200);
      res.body.should.equal('{"message":"Your push event has been queued to be added to CommitStream."}')
      done();
    });
  });
  it('should accept a valid payload and return a 200 OK response.', function(done) {
    request({
      uri: "http://localhost:6565/api/inboxes/" + inbox2 + "?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7",
      method: "POST",
      headers: {
        "x-github-event": "push",
        "content-type": "application/json"
      },
      body: JSON.stringify(commitInbox2)
    }, function(err, res, body) {
      should.not.exist(err);
      res.statusCode.should.equal(200);
      res.body.should.equal('{"message":"Your push event has been queued to be added to CommitStream."}')
      done();
    });
  });
  it('should accept a valid payload and return a 200 OK response.', function(done) {
    request({
      uri: "http://localhost:6565/api/inboxes/" + inbox2 + "?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7",
      method: "POST",
      headers: {
        "x-github-event": "push",
        "content-type": "application/json"
      },
      body: JSON.stringify(commitInbox2WithOutMention)
    }, function(err, res, body) {
      should.not.exist(err);
      res.statusCode.should.equal(200);
      res.body.should.equal('{"message":"Your push event has been queued to be added to CommitStream."}')
      done();
    });
  })
});

describe('api/query after POST', function() {
  it('should return 3 commits when request is made with ALL parameter as workitem.', function(done) {
    request({
      uri: "http://localhost:6565/api/query?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7&digestId=" + digestId + "&workitem=all",
      method: "GET"
    }, function(err, res, body) {
      should.not.exist(err);
      res.statusCode.should.equal(200);
      JSON.parse(res.body).commits.length.should.equal(3);
      done();
    })
  });
  it('should return empty commits when request is made with correct key and workitem.', function(done) {
    request({
      uri: "http://localhost:6565/api/query?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7&digestId=" + digestId + "&workitem=S-11111",
      method: "GET"
    }, function(err, res, body) {
      should.not.exist(err);
      res.statusCode.should.equal(200);
      JSON.parse(res.body).commits.length.should.equal(2);
      done();
    })
  });
});