var chai = require('chai'),
  should = chai.should(),
  proxyquire = require('proxyquire'),
  sinon = require('sinon'),
  uuidStub = sinon.stub(),
  deveoTranslator = proxyquire('../../../api/translators/deveoTranslator', {
    'uuid-v4': uuidStub
  });
require('../../helpers')(global);

// Test data:

var gitPushEventMessageWithOneCommit = {
  "after":"bd4a158555d69bd41fa1b6429c816031152d091d",
  "ref":"refs/heads/master",
  "before":"007c20d3bf35b19e507ecbb52dceb86a91bde173",
  "compare":"",
  "forced":false,
  "created":false,
  "deleted":false,
  "project":{
    "uuid":"f1115b9c-b165-46de-85a7-251805537746",
    "name":"demo-",
    "url":"https://app.deveo.com/Gexample/projects/demo-"},
    "repository":{
      "uuid":"7b23046e-405f-4ec5-b1c9-38875e65369f",
      "name":"gitti1",
      "type":"git",
      "url":"https://app.deveo.com/Gexample/projects/demo-/repositories/gitti1",
      "https_url":"https://app.deveo.com/Gexample/projects/demo-/repositories/git/gitti1",
      "ssh_url":"deveo@app.deveo.com:Gexample/projects/demo-/repositories/git/gitti1",
      "owner":{
        "uuid":"537cf937-427d-4b4a-9133-0dba0341262a",
        "name":"doejohn",
        "email":"ilmari@deveo.com"
      }
    },
  "pusher":{"uuid":"537cf937-427d-4b4a-9133-0dba0341262a",
  "name":"doejohn","display_name":"John Doe"},
  "commit_count":1,
  "commits":[
    {
      "distinct":true,
      "removed":[],
      "message":"readme.m",
      "added":[],
      "timestamp":"2016-09-07T13:58:23Z",
      "modified":["README.md"],
      "url":"https://app.deveo.com/Gexample/projects/demo-/repositories/gitti1/changesets/bd4a158555d69bd41fa1b6429c816031152d091d",
      "author":{
        "name":"Ilmari Kontulainen",
        "email":"ilmari@deveo.com"
      },
      "id":"bd4a158555d69bd41fa1b6429c816031152d091d"
    }
  ]
};

var mercurialPushEventMessageWithOneCommit = {
  "after":"5b634f103ad212848a47a29d306616b002eeb828",
  "ref":"refs/heads/default",
  "before":"",
  "compare":"",
  "forced":false,
  "created":false,
  "deleted":false,
  "project":{
    "uuid":"f1115b9c-b165-46de-85a7-251805537746",
    "name":"demo-",
    "url":"https://app.deveo.com/Gexample/projects/demo-"
  },
  "repository":{
    "uuid":"9371e395-6448-4e8d-8584-b042e3f2859b",
    "name":"foo",
    "type":"mercurial",
    "url":"https://app.deveo.com/Gexample/projects/demo-/repositories/foo",
    "https_url":"https://app.deveo.com/Gexample/projects/demo-/repositories/mercurial/foo",
    "ssh_url":"ssh://deveo@app.deveo.com/Gexample/projects/demo-/repositories/mercurial/foo",
    "owner":{
      "uuid":"537cf937-427d-4b4a-9133-0dba0341262a",
      "name":"doejohn",
      "email":"ilmari@deveo.com"
    }
  },
  "pusher":{
    "uuid":"537cf937-427d-4b4a-9133-0dba0341262a",
    "name":"doejohn",
    "display_name":"John Doe"
  },
  "commit_count":1,
  "commits":[
    {
      "distinct":true,"removed":[],
      "message":"Initial commit.",
      "added":["README.md"],
      "timestamp":"2016-09-07T14:58:49Z",
      "modified":[],
      "url":"https://app.deveo.com/Gexample/projects/demo-/repositories/foo/changesets/5b634f103ad212848a47a29d306616b002eeb828",
      "author":{
        "name":"Ilmari Kontulainen",
        "email":"ilmari@deveo.com"
      },
      "id":"5b634f103ad212848a47a29d306616b002eeb828"
    }
  ]
};

var subversionPushEventMessage = {
  "after":"2",
  "ref":"",
  "before":"1",
  "compare":"",
  "forced":false,
  "created":false,
  "deleted":false,
  "project":{
    "uuid":"f1115b9c-b165-46de-85a7-251805537746",
    "name":"demo-",
    "url":"https://app.deveo.com/Gexample/projects/demo-"
  },
  "repository":{
    "uuid":"19cf0c6f-0743-4e4f-9e28-17f504476c34",
    "name":"svn1",
    "type":"subversion",
    "url":"https://app.deveo.com/Gexample/projects/demo-/repositories/svn1",
    "https_url":"https://app.deveo.com/Gexample/projects/demo-/repositories/subversion/svn1",
    "ssh_url":"svn+ssh://deveo@app.deveo.com/Gexample/projects/demo-/repositories/subversion/svn1",
    "owner":{
      "uuid":"537cf937-427d-4b4a-9133-0dba0341262a",
      "name":"doejohn",
      "email":"ilmari@deveo.com"
    }
  },
  "pusher":{
    "uuid":"537cf937-427d-4b4a-9133-0dba0341262a",
    "name":"doejohn",
    "display_name":"John Doe"
  },
  "commit_count":1,
  "commits":[
    {
      "distinct":true,
      "removed":[],
      "message":"More text.",
      "added":[],
      "timestamp":"2016-09-07T15:05:20Z",
      "modified":["README.md"],
      "url":"https://app.deveo.com/Gexample/projects/demo-/repositories/svn1/changesets/2",
      "author":{
        "name":"doejohn",
        "email":""
      },
      "id":"2"
    }
  ]
};


var pushEventWithSlashInBranchName = clone(gitPushEventMessageWithOneCommit);
pushEventWithSlashInBranchName.ref = 'refs/heads/my-cool-feature/the-thing-we-broke/and-now-we-fix';

var pushEventMessageWithoutRequiredProperty = {
  "ref": "refs/heads/teamRoomUX2_S-51083",
  "before": "300417ed43da3a6819d9ee329e06275e0a377a0c",
  "after": "3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
  "created": false,
  "deleted": false,
  "forced": false,
  "base_ref": null,
  "compare": "https://github.com/openAgile/CommitStream.Web/compare/300417ed43da...3b80fa1b0b56",
  "commits": [{
    "id": "3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
    "distinct": true,
    "message": "Renamed templates. S-51083",
    "timestamp": "2015-01-19T17:00:17-03:00",
    "url": "https://github.com/openAgile/CommitStream.Web/commit/3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
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
    "added": [
      "src/app/client/commitsContainer.html",
      "src/app/client/commitsList.html"
    ],
    "removed": [
      "src/app/client/assetDetailCommits.html",
      "src/app/client/assetDetailInit.html"
    ],
    "modified": [
      "src/app/views/app.handlebars"
    ]
  }],
  "head_commit": {
    "id": "3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
    "distinct": true,
    "message": "Renamed templates. S-51083",
    "timestamp": "2015-01-19T17:00:17-03:00",
    "url": "https://github.com/openAgile/CommitStream.Web/commit/3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
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
    "added": [
      "src/app/client/commitsContainer.html",
      "src/app/client/commitsList.html"
    ],
    "removed": [
      "src/app/client/assetDetailCommits.html",
      "src/app/client/assetDetailInit.html"
    ],
    "modified": [
      "src/app/views/app.handlebars"
    ]
  },
  "pusher": {
    "name": "kunzimariano",
    "email": "kunzi.mariano@gmail.com"
  },
  "organization": {
    "login": "openAgile",
    "id": 6954603,
    "url": "https://api.github.com/orgs/openAgile",
    "repos_url": "https://api.github.com/orgs/openAgile/repos",
    "events_url": "https://api.github.com/orgs/openAgile/events",
    "members_url": "https://api.github.com/orgs/openAgile/members{/member}",
    "public_members_url": "https://api.github.com/orgs/openAgile/public_members{/member}",
    "avatar_url": "https://avatars.githubusercontent.com/u/6954603?v=3",
    "description": null
  },
  "sender": {
    "login": "kunzimariano",
    "id": 1418295,
    "avatar_url": "https://avatars.githubusercontent.com/u/1418295?v=3",
    "gravatar_id": "",
    "url": "https://api.github.com/users/kunzimariano",
    "html_url": "https://github.com/kunzimariano",
    "followers_url": "https://api.github.com/users/kunzimariano/followers",
    "following_url": "https://api.github.com/users/kunzimariano/following{/other_user}",
    "gists_url": "https://api.github.com/users/kunzimariano/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/kunzimariano/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/kunzimariano/subscriptions",
    "organizations_url": "https://api.github.com/users/kunzimariano/orgs",
    "repos_url": "https://api.github.com/users/kunzimariano/repos",
    "events_url": "https://api.github.com/users/kunzimariano/events{/privacy}",
    "received_events_url": "https://api.github.com/users/kunzimariano/received_events",
    "type": "User",
    "site_admin": false
  }
};

describe('deveoTranslator', function() {
  var eventId = '87b66de8-8307-4e03-b2d3-da447c66501a';
  uuidStub.returns(eventId);

  var digestId = 'cd0b1089-7d6d-435a-adf2-125209b1c2c8';
  var instanceId = 'c4abe8e0-e4af-4cc0-8dee-92e698015694';
  var inboxId = 'f68ad5b0-f0e2-428d-847d-1302322eeeb1';

  describe('when translating a push event that contains one commit', function() {
    var expected = [{
      eventId: eventId,
      eventType: "DeveoCommitReceived",
      data: {
        sha: "ssss bd4a158555d69bd41fa1b6429c816031152d091d",
        commit: {
          author: {
            "name": "Ilmari Kontulainen",
            "email": "ilmari@deveo.com"
          },
          committer: {
            name: "Ilmari Kontulainen",
            email: "ilmari@deveo.com",
            date: "2016-09-07T13:58:23Z"
          },
          message: "readme.m"
        },
        html_url: "https://app.deveo.com/Gexample/projects/demo-/repositories/gitti1/changesets/bd4a158555d69bd41fa1b6429c816031152d091d",
        repository: {
          id: "7b23046e-405f-4ec5-b1c9-38875e65369f",
          name: "demo-/gitti1"
        },
        branch: "master",
        originalMessage: gitPushEventMessageWithOneCommit.commits[0]
      },
      metadata: {
        instanceId: instanceId,
        digestId: digestId,
        inboxId: inboxId
      }
    }];

    var actual = deveoTranslator.translatePush(gitPushEventMessageWithOneCommit, instanceId, digestId, inboxId);

    it('should match the expected translation', function() {
      actual.should.deep.equal(expected);
    });
  });

  describe('when translating a push event without required properties', function() {
    it('should raise an exception', function(done) {
      var invokeTranslator = function() {
        deveoTranslator.translatePush(pushEventMessageWithoutRequiredProperty, digestId);
      }
      invokeTranslator.should.throw(deveoTranslator.DeveoCommitMalformedError);
      done();
    });
  });

  describe('when translating a push event', function() {
    it('should parse branch names with slashes correctly', function() {
      var expectedBranchName = 'my-cool-feature/the-thing-we-broke/and-now-we-fix';
      var actual = deveoTranslator.translatePush(pushEventWithSlashInBranchName, instanceId, digestId, inboxId);
      actual[0].data.branch.should.equal(expectedBranchName);
    });
  });

});
