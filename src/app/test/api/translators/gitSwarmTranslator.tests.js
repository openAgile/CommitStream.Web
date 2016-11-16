var chai = require('chai'),
  should = chai.should(),
  proxyquire = require('proxyquire'),
  sinon = require('sinon'),
  GitSwarmCommitMalformedError = require('../../../middleware/gitSwarmCommitMalformedError'),
  uuidStub = sinon.stub(),
  gitSwarmTranslator = proxyquire('../../../api/translators/gitSwarmTranslator', {
    'uuid-v4': uuidStub
  });
require('../../helpers')(global);

var pushEventWithOneCommit = {
  "object_kind": "push",
  "before": "95790bf891e76fee5e1747ab589903a6a1f80f22",
  "after": "da1560886d4f094c3e6c9ef40349f7d38b5d27d7",
  "ref": "refs/heads/master",
  "user_id": 4,
  "user_name": "John Smith",
  "user_email": "john@example.com",
  "project_id": 15,
  "repository": {
    "name": "Diaspora",
    "url": "git@example.com:mike/diasporadiaspora.git",
    "description": "",
    "homepage": "http://example.com/mike/diaspora",
    "git_http_url": "http://example.com/mike/diaspora.git",
    "git_ssh_url": "git@example.com:mike/diaspora.git",
    "visibility_level": 0
  },
  "commits": [{
    "id": "b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327",
    "message": "Update Catalan translation to e38cb41.",
    "timestamp": "2011-12-12T14:27:31+02:00",
    "url": "http://example.com/mike/diaspora/commit/b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327",
    "author": {
      "name": "Jordi Mallach",
      "email": "jordi@softcatala.org"
    }
  }],
  "total_commits_count": 4
};

var pushEventWithSlashInBranchName = clone(pushEventWithOneCommit);
pushEventWithSlashInBranchName.ref = 'refs/heads/my-cool-feature/the-thing-we-broke/and-now-we-fix';

describe('gitSwarmTranslator', function() {

  describe('with appropriate headers', function() {

    it('canTranslate should return true', function() {
      var request = {
        'headers': {
          'x-gitlab-event': 'Push Hook',
          'x-gitswarm-event': 'Push Hook'
        }
      }
      gitSwarmTranslator.canTranslate(request).should.equal(true);
    });

  });

  describe('with incorrect headers', function() {

    it('canTranslate should return false when invalid headers are present', function() {
      var request = {
        'headers': {
          'x-gitlab-event': 'meffeled',
          'x-gitswarm-event': 'meffeled'
        }
      }
      gitSwarmTranslator.canTranslate(request).should.equal(false);
    });

    it('canTranslate should return false when x-gitlab-event and x-gitswarm-event headers aren\'t present', function() {
      var request = {
        'headers': {
        }
      }
      gitSwarmTranslator.canTranslate(request).should.equal(false);
    });

  });

  describe('when translating a malformed push event', function() {
    var invokeTranslatePush;

    beforeEach(function() {
      invokeTranslatePush = function() {
        var malformedPushEvent = {};
        var instanceId = '73b40eab-bbb9-4478-9031-601b9e701d17',
            digestId = '9c369aef-b041-4a38-a76c-d3cf59dec0d2',
            inboxId = '9c369aef-b041-4a38-a76c-d3cf59dec0d2';

        gitSwarmTranslator.translatePush(malformedPushEvent, instanceId, digestId, inboxId);
      }
    });

    it('should throw a GitSwarmCommitMalformedError.', function() {
      invokeTranslatePush.should.throw(GitSwarmCommitMalformedError);
    })
  });

  describe('when translating a push event that contains one commit', function() {
      var instanceId = '73b40eab-bbb9-4478-9031-601b9e701d17',
        digestId = '9c369aef-b041-4a38-a76c-d3cf59dec0d2',
        inboxId = '9c369aef-b041-4a38-a76c-d3cf59dec0d2';
      eventId = '87b66de8-8307-4e03-b2d3-da447c66501a';
      uuidStub.returns(eventId);      

    it('should match the expected translation', function() {
      var instanceId = '73b40eab-bbb9-4478-9031-601b9e701d17',
        digestId = '9c369aef-b041-4a38-a76c-d3cf59dec0d2',
        inboxId = '9c369aef-b041-4a38-a76c-d3cf59dec0d2';
      eventId = '87b66de8-8307-4e03-b2d3-da447c66501a';
      uuidStub.returns(eventId);

      var expected = [{
        eventId: eventId,
        eventType: 'GitSwarmCommitReceived',
        data: {
          sha: 'b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327',
          commit: {
            author: {
              email: "jordi@softcatala.org",
              name: "Jordi Mallach"
            },
            committer: {
              date: "2011-12-12T14:27:31+02:00",
              email: "jordi@softcatala.org",
              name: "Jordi Mallach"
            },
            message: "Update Catalan translation to e38cb41."
          },
          html_url: 'http://example.com/mike/diaspora/commit/b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327',
          repository: {
            name: "Diaspora"
          },
          branch: 'master',
          originalMessage: {
            author: {
              email: "jordi@softcatala.org",
              name: "Jordi Mallach"
            },
            id: "b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327",
            message: "Update Catalan translation to e38cb41.",
            timestamp: "2011-12-12T14:27:31+02:00",
            url: "http://example.com/mike/diaspora/commit/b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327"
          }
        },
        metadata: {
          instanceId: '73b40eab-bbb9-4478-9031-601b9e701d17',
          digestId: '9c369aef-b041-4a38-a76c-d3cf59dec0d2',
          inboxId: '9c369aef-b041-4a38-a76c-d3cf59dec0d2'
        }
      }];

      var actual = gitSwarmTranslator.translatePush(pushEventWithOneCommit, instanceId, digestId, inboxId);

      actual.should.deep.equal(expected);
    });

    it('should parse branch names with slashes correctly', function() {
      var expectedBranchName = 'my-cool-feature/the-thing-we-broke/and-now-we-fix';
      var actual = gitSwarmTranslator.translatePush(pushEventWithSlashInBranchName, instanceId, digestId, inboxId);
      actual[0].data.branch.should.equal(expectedBranchName);
    });
  });
});
