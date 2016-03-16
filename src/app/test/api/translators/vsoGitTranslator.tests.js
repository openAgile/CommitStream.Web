var chai = require('chai'),
    should = chai.should(),
    proxyquire = require('proxyquire'),
    sinon = require('sinon'),
    uuidStub = sinon.stub(),
    vsoGitTranslator = proxyquire('../../../api/translators/vsoGitTranslator', {
        'uuid-v4': uuidStub
    });
require('../../helpers')(global);


var pushEventWithOneCommit = {
    "subscriptionId": "a36104aa-ef6c-4643-ac08-5c42fd2115d3",
    "notificationId": 7,
    "id": "2d01bcf8-83cb-49aa-8d0b-3f2233965060",
    "eventType": "git.push",
    "publisherId": "tfs",
    "message": {
        "text": "Josh Gough pushed updates to branch MyNew/Shelveset of V1 Integration\r\n(https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/#version=GBMyNew%2FShelveset)",
        "html": "Josh Gough pushed updates to branch <a href=\"https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/#version=GBMyNew%2FShelveset\">MyNew/Shelveset</a> of <a href=\"https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1 Integration/\">V1 Integration</a>",
        "markdown": "Josh Gough pushed updates to branch [MyNew/Shelveset](https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/#version=GBMyNew%2FShelveset) of [V1 Integration](https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1 Integration/)"
    },
    "detailedMessage": {
        "text": "Josh Gough pushed 1 commit to branch MyNew/Shelveset of V1 Integration\r\n - S-11011 changed code cf383dd3 (https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/commit/cf383dd370a74a8a5062385f6c1723fcc7cc66eb)",
        "html": "Josh Gough pushed 1 commit to branch <a href=\"https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/#version=GBMyNew%2FShelveset\">MyNew/Shelveset</a> of <a href=\"https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1 Integration/\">V1 Integration</a>\r\n<ul>\r\n<li>changed code <a href=\"https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/commit/cf383dd370a74a8a5062385f6c1723fcc7cc66eb\">cf383dd3</a></li>\r\n</ul>",
        "markdown": "Josh Gough pushed 1 commit to branch [MyNew/Shelveset](https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/#version=GBMyNew%2FShelveset) of [V1 Integration](https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1 Integration/)\r\n* changed code [cf383dd3](https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/commit/cf383dd370a74a8a5062385f6c1723fcc7cc66eb)"
    },
    "resource": {
        "commits": [
            {
                "commitId": "cf383dd370a74a8a5062385f6c1723fcc7cc66eb",
                "author": {
                    "name": "Josh Gough",
                    "email": "jsgough@gmail.com",
                    "date": "2015-11-11T20:13:49Z"
                },
                "committer": {
                    "name": "Josh Gough",
                    "email": "jsgough@gmail.com",
                    "date": "2015-11-11T20:13:49Z"
                },
                "comment": "changed code",
                "url": "https://v1platformtest.visualstudio.com/DefaultCollection/_apis/git/repositories/d29767bb-8f5f-4c43-872f-6c73635a1256/commits/cf383dd370a74a8a5062385f6c1723fcc7cc66eb"
            }
        ],
        "refUpdates": [
            {
                "name": "refs/heads/MyNew/Shelveset",
                "oldObjectId": "0000000000000000000000000000000000000000",
                "newObjectId": "cf383dd370a74a8a5062385f6c1723fcc7cc66eb"
            }
        ],
        "repository": {
            "id": "d29767bb-8f5f-4c43-872f-6c73635a1256",
            "name": "V1 Integration",
            "url": "https://v1platformtest.visualstudio.com/DefaultCollection/_apis/git/repositories/d29767bb-8f5f-4c43-872f-6c73635a1256",
            "project": {
                "id": "213b6eda-2f19-4651-9fa9-ee01a9a75945",
                "name": "V1 Integration",
                "url": "https://v1platformtest.visualstudio.com/DefaultCollection/_apis/projects/213b6eda-2f19-4651-9fa9-ee01a9a75945",
                "state": "wellFormed"
            },
            "defaultBranch": "refs/heads/master",
            "remoteUrl": "https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1 Integration"
        },
        "pushedBy": {
            "id": "0b88cae0-021f-4fa0-b723-d670c74ae474",
            "displayName": "Josh Gough",
            "uniqueName": "jsgough@gmail.com",
            "url": "https://v1platformtest.vssps.visualstudio.com/_apis/Identities/0b88cae0-021f-4fa0-b723-d670c74ae474",
            "imageUrl": "https://v1platformtest.visualstudio.com/DefaultCollection/_api/_common/identityImage?id=0b88cae0-021f-4fa0-b723-d670c74ae474"
        },
        "pushId": 7,
        "date": "2015-11-11T20:13:49.321845Z",
        "url": "https://v1platformtest.visualstudio.com/DefaultCollection/_apis/git/repositories/d29767bb-8f5f-4c43-872f-6c73635a1256/pushes/7",
        "_links": {
            "self": {
                "href": "https://v1platformtest.visualstudio.com/DefaultCollection/_apis/git/repositories/d29767bb-8f5f-4c43-872f-6c73635a1256/pushes/7"
            },
            "repository": {
                "href": "https://v1platformtest.visualstudio.com/DefaultCollection/_apis/git/repositories/d29767bb-8f5f-4c43-872f-6c73635a1256"
            },
            "commits": {
                "href": "https://v1platformtest.visualstudio.com/DefaultCollection/_apis/git/repositories/d29767bb-8f5f-4c43-872f-6c73635a1256/pushes/7/commits"
            },
            "pusher": {
                "href": "https://v1platformtest.vssps.visualstudio.com/_apis/Identities/0b88cae0-021f-4fa0-b723-d670c74ae474"
            },
            "refs": {
                "href": "https://v1platformtest.visualstudio.com/DefaultCollection/_apis/git/repositories/d29767bb-8f5f-4c43-872f-6c73635a1256/refs"
            }
        }
    },
    "resourceVersion": "1.0-preview.1",
    "createdDate": "2015-11-11T20:13:52.4966577Z"
};

describe('vsoGitTranslator', function() {

    describe('with appropriate body', function() {

        it('canTranslate should return true when valid body information is present', function() {
            var request = {
                body: {
                    'eventType': 'git.push',
                    'publisherId': 'tfs'
                }
            };
            vsoGitTranslator.canTranslate(request).should.equal(true);
        });
    });

    describe('with incorrect body', function() {

        it('canTranslate should return false when invalid body information is present', function() {
            var request = {
                body: {
                    'eventType': 'git.pushrr',
                    'publisherId': 'tfs44'
                }
            };
            vsoGitTranslator.canTranslate(request).should.equal(false);
        });

        it('canTranslate should return false when body information isn\'t available', function() {
            var request = {
                body: {}
            };
            vsoGitTranslator.canTranslate(request).should.equal(false);
        });
    });

    describe('with valid body', function() {
        uuidStub.returns(1234);
        var expected = [{
            eventId: 1234,
            eventType: 'VsoGitCommitReceived',
            data: {
                "sha": "cf383dd370a74a8a5062385f6c1723fcc7cc66eb",
                "commit": {
                    "author": {
                        "name": "Josh Gough",
                        "email": "jsgough@gmail.com"
                    },
                    "committer": {
                        "name": "Josh Gough",
                        "email": "jsgough@gmail.com",
                        "date": "2015-11-11T20:13:49Z"
                    },
                    "message": "changed code"
                },
                "html_url": "https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/commit/cf383dd370a74a8a5062385f6c1723fcc7cc66eb",
                "repository": {
                    "id": "d29767bb-8f5f-4c43-872f-6c73635a1256",
                    "name": "V1 Integration"
                },
                "branch": "MyNew/Shelveset",
                "originalMessage": {
                    "commitId": "cf383dd370a74a8a5062385f6c1723fcc7cc66eb",
                    "author": {
                        "name": "Josh Gough",
                        "email": "jsgough@gmail.com",
                        "date": "2015-11-11T20:13:49Z"
                    },
                    "committer": {
                        "name": "Josh Gough",
                        "email": "jsgough@gmail.com",
                        "date": "2015-11-11T20:13:49Z"
                    },
                    "comment": "changed code",
                    "url": "https://v1platformtest.visualstudio.com/DefaultCollection/_apis/git/repositories/d29767bb-8f5f-4c43-872f-6c73635a1256/commits/cf383dd370a74a8a5062385f6c1723fcc7cc66eb"
                }
            },
            metadata: {
                instanceId: '111',
                digestId: '222',
                inboxId: '333'
            }
        }];

        it('returns the expected object', function() {
            var actual = vsoGitTranslator.translatePush(pushEventWithOneCommit, '111', '222', '333');
            actual.should.deep.equal(expected);
        });
    });

    describe('with invalid body', function() {

        var invokeTranslatePush = function() {
            vsoGitTranslator.translatePush({}, '111', '222', '333')
        }
        invokeTranslatePush.should.throw(vsoGitTranslator.VsoGitCommitMalformedError);
    });

});