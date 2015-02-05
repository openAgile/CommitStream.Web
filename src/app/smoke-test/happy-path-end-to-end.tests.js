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

var commitInboxA = {
  "ref": "refs/heads/master",
  "commits": [{
    "id": "b42c285e1506edac965g92573a2121700fc92f8b",
    "distinct": true,
    "message": "S-11111 Updated Happy Path Validations!",
    "timestamp": "2014-10-03T15:57:14-03:00",
    "url": "https://github.com/kunzimariano/CommitService.DemoRepo/commit/b42c285e1506edac965g92573a2121700fc92f8b",
    "author": {
      "name": "shawnmarie",
      "email": "shawn.abbott@versionone.com",
      "username": "shawnmarie"
    },
    "committer": {
      "name": "shawnmarie",
      "email": "shawn.abbott@versionone.com",
      "username": "shawnmarie"
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
var digestIdA = undefined;
var urlToCreateInbox = undefined;
var urlToCreateInboxA = undefined;
var urlToPushCommitToInbox1 = undefined;
var urlToPushCommitToInbox2 = undefined;
var urlToPushCommitToInboxA = undefined;

describe('you need a digest to associate to the inboxes that will be created', function() {
  it('should return error message with 401 Unauthorized response when request is made without a key.', function(done) {
    request({
      uri: "http://localhost:6565/api/digest?workitem=S-11111",
      method: "POST",
      body: JSON.stringify({
        description: "Digest 1"
      })
    }, function(err, res, body) {
      should.not.exist(err);
      res.statusCode.should.equal(401);
      res.body.should.equal('API key parameter missing or invalid');
      done();
    })
  });

  it('should return error when request is made with incorrect key.', function(done) {
    request({
      uri: "http://localhost:6565/api/digest?key=S-11111",
      method: "POST",
      body: JSON.stringify({
        description: "Digest 1"
      })
    }, function(err, res, body) {
      should.not.exist(err);
      res.statusCode.should.equal(401);
      res.body.should.equal('API key parameter missing or invalid');
      done();
    })
  });

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
      urlToCreateInbox = JSON.parse(body)._links['inbox-create'].href;
      digestIdCreated.should.exist;
      digestId = digestIdCreated;
      done();
    });
  });
  it('create the inbox and associate to the digest created', function(done) {
    request({
      uri: urlToCreateInbox + "?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7",
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
      urlToPushCommitToInbox1 = JSON.parse(body)._links['self'].href;
      inboxIdCreated.should.exist;
      done();
    });
  });
  it('create a different inbox and associate to the same digest created', function(done) {
    request({
      uri: urlToCreateInbox + "?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7",
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
      urlToPushCommitToInbox2 = JSON.parse(body)._links['self'].href;
      inboxIdCreated.should.exist;
      done();
    });
  });
});

describe('need a second digest for same workitem', function() {
  it('create a second new digest.', function(done) {
    request({
      uri: "http://localhost:6565/api/digests?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7",
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        description: "Digest A"
      })
    }, function(err, res, body) {
      should.not.exist(err);
      var digestIdCreated = JSON.parse(body).digestId;
      urlToCreateInboxA = JSON.parse(body)._links['inbox-create'].href;
      digestIdCreated.should.exist;
      digestIdA = digestIdCreated;
      done();
    });
  });

  it('create inbox and associate it to the second digest.', function(done) {
    request({
      uri: urlToCreateInboxA + "?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7",
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        name: "Inbox A",
        digestId: digestIdA,
        family: "GitHub"
      })
    }, function(err, res, body) {
      should.not.exist(err);
      var inboxIdCreated = JSON.parse(body).inboxId;
      urlToPushCommitToInboxA = JSON.parse(body)._links['self'].href;
      inboxIdCreated.should.exist;
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
      res.body.should.equal('{"commits":[],"_links":{}}');
      done();
    });
  });
});

describe('api/inboxes', function() {
  it('the first inbox should accept a valid payload and return a 201 OK response.', function(done) {
    request({
      uri: urlToPushCommitToInbox1 + "?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7",
      method: "POST",
      headers: {
        "x-github-event": "push",
        "content-type": "application/json"
      },
      body: JSON.stringify(commitInbox1)
    }, function(err, res, body) {
      should.not.exist(err);
      res.statusCode.should.equal(201);
      JSON.parse(res.body).message.should.equal('Your push event has been queued to be added to CommitStream.')
      done();
    });
  });
  it('The second inbox should accept a valid payload and return a 201 OK response.', function(done) {
    request({
      uri: urlToPushCommitToInbox2 + "?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7",
      method: "POST",
      headers: {
        "x-github-event": "push",
        "content-type": "application/json"
      },
      body: JSON.stringify(commitInbox2)
    }, function(err, res, body) {
      should.not.exist(err);
      res.statusCode.should.equal(201);
      JSON.parse(res.body).message.should.equal('Your push event has been queued to be added to CommitStream.')
      done();
    });
  });
  it('The secound inbox should accept a valid payload with no mention of a workitem and return a 201 OK response.', function(done) {
    request({
      uri: urlToPushCommitToInbox2 + "?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7",
      method: "POST",
      headers: {
        "x-github-event": "push",
        "content-type": "application/json"
      },
      body: JSON.stringify(commitInbox2WithOutMention)
    }, function(err, res, body) {
      should.not.exist(err);
      res.statusCode.should.equal(201);
      JSON.parse(res.body).message.should.equal('Your push event has been queued to be added to CommitStream.')
      done();
    });
  });
  it('The third inbox should accept a valid payload and return a 201 OK response.', function(done) {
    request({
      uri: urlToPushCommitToInboxA + "?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7",
      method: "POST",
      headers: {
        "x-github-event": "push",
        "content-type": "application/json"
      },
      body: JSON.stringify(commitInboxA)
    }, function(err, res, body) {
      should.not.exist(err);
      res.statusCode.should.equal(201);
      JSON.parse(res.body).message.should.equal('Your push event has been queued to be added to CommitStream.')
      done();
    });
  });
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

  // it('should accept a valid payload and returns 2 commits for a specified digestId and a specified workitem.', function(done) {
  //   // console.log();
  //   // console.log('digestId:');
  //   // console.log(digestId);
  //   // console.log();
  //   // console.log('digestIdA:')
  //   // console.log(digestIdA);
  //   // console.log("http://localhost:6565/api/query?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7&digestId=" + digestId + "&workitem=S-11111");
  //   request({
  //     uri: "http://localhost:6565/api/query?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7&digestId=" + digestId + "&workitem=S-11111",
  //     method: "GET"
  //   }, function(err, res, body) {
  //     should.not.exist(err);
  //     res.statusCode.should.equal(200);
  //     JSON.parse(res.body).commits.length.should.equal(2);
  //     done();
  //   })
  // });

  it('should accept a valid payload and return commit details for the specified workitem.', function(done) {
    this.timeout(5000);

    setTimeout(function() {
      request({
        uri: "http://localhost:6565/api/query?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7&workitem=S-11111",
        method: "GET"
      }, function(err, res, body) {
        should.not.exist(err);
        res.statusCode.should.equal(200);

        // Need to remove the 'timeFormatted' field from the response body as
        // we can not rely on that value staying constant as time moves on. It will
        // change because we are using the timeago package to transform it into values
        // like '3 months ago'. But once a month increments, then our assertion will be wrong
        // because the actual value at runtime will then be '4 months ago'
        var cleanedBody = JSON.parse(res.body);
        cleanedBody.commits = _.map(cleanedBody.commits, function(value, key, list) {
          return _.omit(value, 'timeFormatted');
        })

        cleanedBody = JSON.stringify(cleanedBody);
        cleanedBody.should.equal("{\"commits\":[{\"commitDate\":\"2014-10-03T15:57:14-03:00\",\"author\":\"shawnmarie\",\"sha1Partial\":\"b42c28\",\"action\":\"committed\",\"message\":\"S-11111 Updated Happy Path Validations!\",\"commitHref\":\"https://github.com/kunzimariano/CommitService.DemoRepo/commit/b42c285e1506edac965g92573a2121700fc92f8b\",\"repo\":\"kunzimariano/CommitService.DemoRepo\",\"branch\":\"master\",\"branchHref\":\"https://github.com/kunzimariano/CommitService.DemoRepo/tree/master\",\"repoHref\":\"https://github.com/kunzimariano/CommitService.DemoRepo\"},{\"commitDate\":\"2014-10-03T15:57:14-03:00\",\"author\":\"kunzimariano\",\"sha1Partial\":\"d31d17\",\"action\":\"committed\",\"message\":\"S-11111 Modified UI validations!\",\"commitHref\":\"https://github.com/kunzimariano/CommitService.DemoRepo/commit/d31d174f0495feaf876e92573a2121700fd81e7a\",\"repo\":\"kunzimariano/CommitService.DemoRepo\",\"branch\":\"master\",\"branchHref\":\"https://github.com/kunzimariano/CommitService.DemoRepo/tree/master\",\"repoHref\":\"https://github.com/kunzimariano/CommitService.DemoRepo\"},{\"commitDate\":\"2014-10-03T15:57:14-03:00\",\"author\":\"laureanoremedi\",\"sha1Partial\":\"d31d17\",\"action\":\"committed\",\"message\":\"S-11111 initial Commit to backend functionality!\",\"commitHref\":\"https://github.com/kunzimariano/CommitService.DemoRepo/commit/d31d174f0495feaf876e92573a2121700fd81e7a\",\"repo\":\"kunzimariano/CommitService.DemoRepo\",\"branch\":\"master\",\"branchHref\":\"https://github.com/kunzimariano/CommitService.DemoRepo/tree/master\",\"repoHref\":\"https://github.com/kunzimariano/CommitService.DemoRepo\"}]}");
        done();
      });
    }, 3000);
  });

  it('should return empty commits when request is made with correct key but incorrect workitem.', function(done) {
    request({
      uri: "http://localhost:6565/api/query?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7&workitem=11111",
      method: "GET"
    }, function(err, res, body) {
      should.not.exist(err);
      res.statusCode.should.equal(200);
      res.body.should.equal('{"commits":[]}');
      done();
    })
  });

  it('should return error message when request is made with correct key but no workitem.', function(done) {
    request({
      uri: "http://localhost:6565/api/query?key=32527e4a-e5ac-46f5-9bad-2c9b7d607bd7",
      method: "GET"
    }, function(err, res, body) {
      should.not.exist(err);
      res.statusCode.should.equal(400);
      res.body.should.equal('{"error":"Parameter workitem is required"}');
      done();
    })
  });
});