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
