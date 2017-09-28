var chai = require('chai'),
    should = chai.should(),
    proxyquire = require('proxyquire'),
    sinon = require('sinon'),
    uuidStub = sinon.stub(),
    CtfGitCommitMalformedError = require('../../../middleware/ctfGitCommitMalformedError'),
    ctfGitTranslator = proxyquire('../../../api/translators/ctfGitTranslator', {
        'uuid-v4': uuidStub
    });

require('../../helpers')(global);

var commit = {
		"project": {
			"id": "proj1013",
			"url": "http://main.server.collab.net/sf/projects/check_url_path"
		},
		"event_type": "ref-updated",
		"ref": "refs/heads/master",
		"before": "54823e9181f2ca78dc625e2fe13aecb1c3b4fd41",
		"after": "3ddbe1ee1a0909e5dcbb62ac61b7b266922912c0",
		"created": false,
		"deleted": false,
		"forced": false,
		"commits": [
			{
				"id": "3ddbe1ee1a0909e5dcbb62ac61b7b266922912c0",
				"tree_id": "1a66c81509d148978a95638f114e31e6a217ae29",
				"distinct": true,
				"message": "Send to publick hookbin :D\n\nChange-Id: I9b09d4490246baa13933fae237e6e5e355614917\n",
				"timestamp": "2017-09-15T06:04:23Z",
				"url": "http://main.server.collab.net/ctf/code/git/projects.check_url_path/scm.test_repo/commits?treeId=3ddbe1ee1a0909e5dcbb62ac61b7b266922912c0",
				"author": {
					"name": "TeamForge Administrator",
					"email": "root@ctf-centos72-dev-box.collab.net",
					"username": "admin"
				},
				"committer": {
					"name": "TeamForge Administrator",
					"email": "root@ctf-centos72-dev-box.collab.net",
					"username": "admin"
				},
				"added": [],
				"removed": [],
				"modified": [
					"test.file"
					]
			}
			],
			"head_commit": {
				"id": "3ddbe1ee1a0909e5dcbb62ac61b7b266922912c0",
				"tree_id": "1a66c81509d148978a95638f114e31e6a217ae29",
				"distinct": true,
				"message": "Send to publick hookbin :D\n\nChange-Id: I9b09d4490246baa13933fae237e6e5e355614917\n",
				"timestamp": "2017-09-15T06:04:23Z",
				"url": "http://main.server.collab.net/ctf/code/git/projects.check_url_path/scm.test_repo/commits?treeId=3ddbe1ee1a0909e5dcbb62ac61b7b266922912c0",
				"author": {
					"name": "TeamForge Administrator",
					"email": "root@ctf-centos72-dev-box.collab.net",
					"username": "admin"
				},
				"committer": {
					"name": "TeamForge Administrator",
					"email": "root@ctf-centos72-dev-box.collab.net",
					"username": "admin"
				},
				"added": [],
				"removed": [],
				"modified": [
					"test.file"
					]
			},
			"repository": {
				"id": "reps1004",
				"name": "test_repo",
				"full_name": "test_repo",
				"description": "| Repo Category: optional_review, History Protection: On",
				"url": "http://main.server.collab.net/ctf/code/git/projects.check_url_path/scm.test_repo/tree"
			},
			"pusher": {
				"name": "TeamForge Administrator",
				"email": "root@ctf-centos72-dev-box.collab.net",
				"username": "admin"
			}
}

describe('ctfGitTranslator', function() {

    describe('with appropriate body', function() {

        it('canTranslate should return true when valid header information is present', function() {
            var request = {
                    'headers': {
                        "x-ctf-scm": "git"
                    },
                    body: commit
            };
            ctfGitTranslator.canTranslate(request).should.equal(true);
        });
    });

    describe('with incorrect headers', function() {

        it('canTranslate should return false when invalid headers information is present', function() {
            var request = {
                    'headers': {
                        "OTHERHEADER": "Commit Event"
                    },
                    body: commit
            };
            ctfGitTranslator.canTranslate(request).should.equal(false);
        });
    });

    describe('with incorrect event type', function() {

        it('canTranslate should return false when invalid event type information is present', function() {
            var request = {
                    'headers': {
                        "x-ctf-scm": "git"
                    },
                    'body': {
                        "event_type": "post-commit"
                    }
            };
            ctfGitTranslator.canTranslate(request).should.equal(false);
        });
    });

    describe('with invalid header value', function() {

        it('canTranslate should return false with invalid header value', function() {
            var request = {
                    'headers': {
                        "x-ctf-scm": "scm"
                    },
                    body: commit
            };
            ctfGitTranslator.canTranslate(request).should.equal(false);
        });
    });

    describe('with valid body', function() {
        uuidStub.returns(1234);
        var expected = [{
            eventId: 1234,
            eventType: 'CtfGitCommitReceived',
            data: {
                "sha": commit.commits[0].id,
                "commit": {
                    "author": {
                        "name": commit.commits[0].author.name,
                        "email": commit.commits[0].author.email
                    },
                    "committer": {
                        "name": commit.commits[0].committer.name,
                        "email": commit.commits[0].committer.email,
                        "date": commit.commits[0].timestamp
                    },
                    "message": commit.commits[0].message
                },
                "html_url": commit.commits[0].url,
                "repository": {
                    "id": commit.repository.id,
                    "name": commit.repository.name,
                    "url": commit.repository.url
                },
                "branch": "master",
                "originalMessage": commit.commits[0]
            },
            metadata: {
                instanceId: '111',
                digestId: '222',
                inboxId: '333'
            }
        }];
        it('returns the expected object', function() {
            var actual = ctfGitTranslator.translatePush(commit, '111', '222', '333');
            actual.should.deep.equal(expected);
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

                ctfGitTranslator.translatePush(malformedPushEvent, instanceId, digestId, inboxId)
            }
        });

        it('should throw CtfGitCommitMalformedError', function() {
            invokeTranslatePush.should.throw(CtfGitCommitMalformedError);
        });

    });

});