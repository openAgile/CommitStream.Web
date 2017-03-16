var chai = require('chai'),
    should = chai.should(),
    proxyquire = require('proxyquire'),
    sinon = require('sinon'),
    uuidStub = sinon.stub(),
    tfvcCommitMalformedError = require('../../../middleware/tfvcCommitMalformedError'),
    tfvcTranslator = proxyquire('../../../api/translators/tfvcTranslator', {
        'uuid-v4': uuidStub
    });
require('../../helpers')(global);

var tfvcPushEventForOneProject = {
    "subscriptionId": "20019a9b-3534-4705-a755-198d23de2ed7",
    "notificationId": 6,
    "id": "b72be65b-614d-4652-9ca9-11d2942a5c91",
    "eventType": "tfvc.checkin",
    "publisherId": "tfs",
    "scope": "all",
    "message": {
        "text": "Josh Gough checked in changeset 17: Updated README.md S-12345",
        "html": "Josh Gough checked in changeset <a href=\"https://v1platformtest.visualstudio.com/web/cs.aspx?pcguid=6b1d2d92-0bb2-4ff1-b1e0-5b79fd2abd67&amp;cs=17\">17</a>: Updated README.md S-12345",
        "markdown": "Josh Gough checked in changeset [17](https://v1platformtest.visualstudio.com/web/cs.aspx?pcguid=6b1d2d92-0bb2-4ff1-b1e0-5b79fd2abd67&cs=17): Updated README.md S-12345"
    },
    "detailedMessage": {
        "text": "Josh Gough checked in changeset 17: Updated README.md S-12345",
        "html": "Josh Gough checked in changeset <a href=\"https://v1platformtest.visualstudio.com/web/cs.aspx?pcguid=6b1d2d92-0bb2-4ff1-b1e0-5b79fd2abd67&amp;cs=17\">17</a>: Updated README.md S-12345",
        "markdown": "Josh Gough checked in changeset [17](https://v1platformtest.visualstudio.com/web/cs.aspx?pcguid=6b1d2d92-0bb2-4ff1-b1e0-5b79fd2abd67&cs=17): Updated README.md S-12345"
    },
    "resource": {
        "hasMoreChanges": true,
        "teamProjectIds": [
            "b70385b4-ae0f-4afd-b166-6aff62bfd0b0"
        ],
        "changesetId": 17,
        "url": "https://v1platformtest.visualstudio.com/_apis/tfvc/changesets/17",
        "author": {
            "id": "0b88cae0-021f-4fa0-b723-d670c74ae474",
            "displayName": "Josh Gough",
            "uniqueName": "jsgough@gmail.com",
            "url": "https://app.vssps.visualstudio.com/A95780de7-c7d8-4742-a6e7-12e311437415/_apis/Identities/0b88cae0-021f-4fa0-b723-d670c74ae474",
            "imageUrl": "https://v1platformtest.visualstudio.com/_api/_common/identityImage?id=0b88cae0-021f-4fa0-b723-d670c74ae474"
        },
        "checkedInBy": {
            "id": "0b88cae0-021f-4fa0-b723-d670c74ae474",
            "displayName": "Josh Gough",
            "uniqueName": "jsgough@gmail.com",
            "url": "https://app.vssps.visualstudio.com/A95780de7-c7d8-4742-a6e7-12e311437415/_apis/Identities/0b88cae0-021f-4fa0-b723-d670c74ae474",
            "imageUrl": "https://v1platformtest.visualstudio.com/_api/_common/identityImage?id=0b88cae0-021f-4fa0-b723-d670c74ae474"
        },
        "createdDate": "2017-01-20T16:28:45Z",
        "comment": "Updated README.md S-12345"
    },
    "resourceVersion": "1.0",
    "resourceContainers": {
        "collection": {
            "id": "6b1d2d92-0bb2-4ff1-b1e0-5b79fd2abd67",
            "baseUrl": "https://v1platformtest.visualstudio.com/"
        },
        "account": {
            "id": "95780de7-c7d8-4742-a6e7-12e311437415",
            "baseUrl": "https://v1platformtest.visualstudio.com/"
        }
    },
    "createdDate": "2017-01-20T16:28:47.755774Z"
};

var tfvcPushEventForMoreThanOneProject= {
    "subscriptionId": "5a5419f9-8deb-46ca-8c9b-825e80311c6c",
    "notificationId": 1,
    "id": "b396843b-6f58-408d-b6dd-468be8d7a615",
    "eventType": "tfvc.checkin",
    "publisherId": "tfs",
    "scope": "all",
    "message": {
        "text": "Sally Ann Cavanaugh checked in changeset 22",
        "html": "Sally Ann Cavanaugh checked in changeset <a href=\"https://testsystem.visualstudio.com/web/cs.aspx?pcguid=80c24ec7-6164-46d7-9b2a-ab3d60d8dc71&amp;cs=22\">22</a>",
        "markdown": "Sally Ann Cavanaugh checked in changeset [22](https://testsystem.visualstudio.com/web/cs.aspx?pcguid=80c24ec7-6164-46d7-9b2a-ab3d60d8dc71&cs=22)"
    },
    "detailedMessage": {
        "text": "Sally Ann Cavanaugh checked in changeset 22",
        "html": "Sally Ann Cavanaugh checked in changeset <a href=\"https://testsystem.visualstudio.com/web/cs.aspx?pcguid=80c24ec7-6164-46d7-9b2a-ab3d60d8dc71&amp;cs=22\">22</a>",
        "markdown": "Sally Ann Cavanaugh checked in changeset [22](https://testsystem.visualstudio.com/web/cs.aspx?pcguid=80c24ec7-6164-46d7-9b2a-ab3d60d8dc71&cs=22)"
    },
    "resource": {
        "hasMoreChanges": true,
        "teamProjectIds": ["70cf8e3a-3ee1-4127-95d2-7f2563e5dc9e", "fdc49ee6-ec19-43a4-bd08-55800484b342"],
        "changesetId": 22,
        "url": "https://testsystem.visualstudio.com/_apis/tfvc/changesets/22",
        "author": {
            "id": "2c22451e-cd97-454e-aa61-bf076557ab3f",
            "displayName": "Sally Ann Cavanaugh",
            "uniqueName": "scavanaugh@nowhere.com",
            "url": "https://thing.somewhere.visualstudio.com/A7d7713ab-3a77-4625-a298-2f17fba9310b/_apis/Identities/2c22451e-cd97-454e-aa61-bf076557ab3f",
            "imageUrl": "https://testsystem.visualstudio.com/_api/_common/identityImage?id=2c22451e-cd97-454e-aa61-bf076557ab3f"
        },
        "checkedInBy": {
            "id": "2c22451e-cd97-454e-aa61-bf076557ab3f",
            "displayName": "Sally Ann Cavanaugh",
            "uniqueName": "scavanaugh@nowhere.com",
            "url": "https://thing.somewhere.visualstudio.com/A7d7713ab-3a77-4625-a298-2f17fba9310b/_apis/Identities/2c22451e-cd97-454e-aa61-bf076557ab3f",
            "imageUrl": "https://testsystem.visualstudio.com/_api/_common/identityImage?id=2c22451e-cd97-454e-aa61-bf076557ab3f"
        },
        "createdDate": "2017-03-08T20:54:34Z",
        "comment": ""
    },
    "resourceVersion": "1.0",
    "resourceContainers": {
        "collection": {
            "id": "80c24ec7-6164-46d7-9b2a-ab3d60d8dc71",
            "baseUrl": "https://testsystem.visualstudio.com/"
        },
        "account": {
            "id": "7d7713ab-3a77-4625-a298-2f17fba9310b",
            "baseUrl": "https://testsystem.visualstudio.com/"
        }
    },
    "createdDate": "2017-03-08T20:54:37.2569716Z"
};

describe('tfvcTranslator', function() {
    var eventId = '87b66de8-8307-4e03-b2d3-da447c66501a';
    uuidStub.returns(eventId);

    var digestId = 'cd0b1089-7d6d-435a-adf2-125209b1c2c8';
    var instanceId = 'c4abe8e0-e4af-4cc0-8dee-92e698015694';
    var inboxId = 'f68ad5b0-f0e2-428d-847d-1302322eeeb1';

    describe('when translating any valid TFVC push event', function() {
        var request;

        before(function() {
            request = {
                body: tfvcPushEventForOneProject
            };
        });

        it('the translator should say it can translate the event', function() {
            tfvcTranslator.canTranslate(request).should.equal(true);
        });

        it('it should have valid properties', function() {
            tfvcTranslator.canTranslate(request).should.equal(true);
        });
    });
    });

    describe('when translating a push event that contains one commit for one project', function() {
        var expected = [{
            eventId: eventId,
            eventType: "TfvcCommitReceived",
            data: {
                sha: "b72be65b-614d-4652-9ca9-11d2942a5c91",
                commit: {
                    author: {
                        name: "Josh Gough",
                        email: "jsgough@gmail.com"
                    },
                    committer: {
                        name: "Josh Gough",
                        email: "jsgough@gmail.com",
                        date: ''
                    },
                    message: "Josh Gough checked in changeset 17: Updated README.md S-12345"
                },
                html_url: ["https://v1platformtest.visualstudio.com/b70385b4-ae0f-4afd-b166-6aff62bfd0b0/_versionControl/changeset/17"],
                repository: {
                    url: ["https://v1platformtest.visualstudio.com/b70385b4-ae0f-4afd-b166-6aff62bfd0b0/_versionControl/"]
                },
                branch: '',
                originalMessage: tfvcPushEventForOneProject
            },
            metadata: {
                instanceId: instanceId,
                digestId: digestId,
                inboxId: inboxId
            }
        }];
        var actual;

        beforeEach(function() {
            actual = tfvcTranslator.translatePush(tfvcPushEventForOneProject, instanceId, digestId, inboxId);
        });

        it('translated event should match our expected shape of data', function () {
            actual.should.deep.equal(expected);
        });
    });

    describe('when translating a push event that contains more than one commit for one project', function() {
        var expected = [{
            eventId: eventId,
            eventType: "TfvcCommitReceived",
            data: {
                sha: "b396843b-6f58-408d-b6dd-468be8d7a615",
                commit: {
                    author: {
                        name: "Sally Ann Cavanaugh",
                        email: "scavanaugh@nowhere.com"
                    },
                    committer: {
                        name: "Sally Ann Cavanaugh",
                        email: "scavanaugh@nowhere.com",
                        date: ''
                    },
                    message: "Sally Ann Cavanaugh checked in changeset 22"
                },
                html_url:[ "https://testsystem.visualstudio.com/70cf8e3a-3ee1-4127-95d2-7f2563e5dc9e/_versionControl/changeset/22",
                           "https://testsystem.visualstudio.com/fdc49ee6-ec19-43a4-bd08-55800484b342/_versionControl/changeset/22"],
                repository: {
                    url: ["https://testsystem.visualstudio.com/70cf8e3a-3ee1-4127-95d2-7f2563e5dc9e/_versionControl/",
                          "https://testsystem.visualstudio.com/fdc49ee6-ec19-43a4-bd08-55800484b342/_versionControl/"]
                },
                branch: '',
                originalMessage: tfvcPushEventForMoreThanOneProject
            },
            metadata: {
                instanceId: instanceId,
                digestId: digestId,
                inboxId: inboxId
            }
        }];
        var actual;

        beforeEach(function() {
            actual = tfvcTranslator.translatePush(tfvcPushEventForMoreThanOneProject, instanceId, digestId, inboxId);
        });

        it('translated event should match our expected shape of data', function () {
            actual.should.deep.equal(expected);
        });
    });

    describe('when translating a malformed push event', function() {
        var invokeTranslatePush;

        beforeEach(function() {
            invokeTranslatePush = function() {
                var malformedPushEvent = {};
                tfvcTranslator.translatePush(malformedPushEvent, instanceId, digestId, inboxId)
            }
        });

        it('should throw tfvcCommitMalformedError', function() {
            invokeTranslatePush.should.throw(tfvcCommitMalformedError);
        });
    });
});