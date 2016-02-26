import chai from 'chai';
const should = chai.should();
import proxyrequire from 'proxyquire';
import sinon from 'sinon';
const unidStub = sinon.stub();
const vsoGitTranslator = proxyquire('../../../api/translators/vsoGitTranslator', {
    'uuid-v4': uuidStub
});
import helpers from '../../helpers';
helpers(global);

const pushEventWithOneCommit = {
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
        "text": `Josh Gough pushed 1 commit to branch MyNew/Shelveset of V1 Integration\r\n - S-11011 changed code cf383dd3 (https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/commit/cf383dd370a74a8a5062385f6c1723fcc7cc66eb)`,
        "html": `Josh Gough pushed 1 commit to branch <a href=\"https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/#version=GBMyNew%2FShelveset\">MyNew/Shelveset</a> of <a href=\"https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1 Integration/\">V1 Integration</a>\r\n<ul>\r\n<li>changed code <a href=\"https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/commit/cf383dd370a74a8a5062385f6c1723fcc7cc66eb\">cf383dd3</a></li>\r\n</ul>`,
        "markdown": `Josh Gough pushed 1 commit to branch [MyNew/Shelveset](https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/#version=GBMyNew%2FShelveset) of [V1 Integration](https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1 Integration/)\r\n* changed code [cf383dd3](https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/commit/cf383dd370a74a8a5062385f6c1723fcc7cc66eb)`
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
                "comment": message,
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

    describe('with appropriate headers', function() {

        it('canTranslate should return true when valid headers are present', function() {
            var request = {
                body: {
                    'eventType': 'git.push',
                    'publisherId': 'tfs'
                }
            };
            vsoGitTranslator.canTranslate(request).should.equal(true);
        });

    });

    describe('with incorrect headers', function() {

        it('canTranslate should return false when invalid headers are present', function() {
            var request = {
                headers: {
                    'x-event-key': 'dummy value'
                }
            };
            vsoGitTranslator.canTranslate(request).should.equal(false);
        });

        it('canTranslate should return false when user-agent header isn\'t available', function() {
            var request = {
                headers: {}
            };
            vsoGitTranslator.canTranslate(request).should.equal(false);
        });

    });

    describe('with valid body', function() {
        uuidStub.returns(1234);

        var expected = [{
            eventId: 1234,
            eventType: 'BitbucketCommitReceived',
            data: {
                sha: '24480f9c4f1b4cff6c8ccec86416f6b258b75b22',
                commit: {
                    author: "kunzimariano",
                    committer: {
                        date: "2015-08-18T18:43:11+00:00",
                        email: "Mariano Kunzi <kunzi.mariano@gmail.com>",
                        name: "Mariano Kunzi"
                    },
                    message: "README.md edited online with Bitbucket"
                },
                html_url: 'https://bitbucket.org/kunzimariano/test/commits/24480f9c4f1b4cff6c8ccec86416f6b258b75b22',
                repository: {
                    id: "{9ad3f4a8-99d8-4b50-be5c-807459179855}",
                    name: "test"
                },
                branch: 'master',
                originalMessage: {
                    "hash": "24480f9c4f1b4cff6c8ccec86416f6b258b75b22",
                    "author": {
                        "raw": "Mariano Kunzi <kunzi.mariano@gmail.com>",
                        "user": {
                            "display_name": "Mariano Kunzi",
                            "username": "kunzimariano"
                        }
                    },
                    "links": {
                        "html": {
                            "href": "https://bitbucket.org/kunzimariano/test/commits/24480f9c4f1b4cff6c8ccec86416f6b258b75b22"
                        }
                    },
                    "message": "README.md edited online with Bitbucket"
                }
            },
            metadata: {
                instanceId: '111',
                digestId: '222',
                inboxId: '333'
            }
        }];

        it('returns the expected object', function() {
            var actual = vsoGitTranslator.translatePush(pushEvent, '111', '222', '333');
            actual.should.deep.equal(expected);

        });

    });

    describe('with invalid body', function() {

        var invokeTranslatePush = function() {
            vsoGitTranslator.translatePush({}, '111', '222', '333')
        }
        invokeTranslatePush.should.throw(BitbucketCommitMalformedError);
    });

});