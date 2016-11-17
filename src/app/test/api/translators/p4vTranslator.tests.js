var chai = require('chai'),
    should = chai.should(),
    proxyquire = require('proxyquire'),
    sinon = require('sinon'),
    uuidStub = sinon.stub(),
    P4vCommitMalformedError = require('../../../middleware/p4vCommitMalformedError'),
    p4vTranslator = proxyquire('../../../api/translators/p4vTranslator', {
        'uuid-v4': uuidStub
    });

require('../../helpers')(global);


var commit = {
    "author":  "admin",
    "message":  "delete file",
    "repository":  "http://v1commitstream.cloudapp.net:9090/svn/ProjectA",
    "pretext":  "Commit completed:  rev. 8",
    "committer":  {
                     "name":  "admin",
                     "date":  "2016-07-21 08:08:00 +1300 (Thu, 21 Jul 2016)"
                 },
    "revision": "53",
    "html_url":  "http://v1commitstream.cloudapp.net:9090/!/#ProjectA/commit/r8",
    "changes":  [
                    "... //pablo.txt delete"
                ]
}

describe('p4vTranslator', function() {

    describe('with appropriate body', function() {

        it('canTranslate should return true when valid header information is present', function() {
            var request = {
                'headers': {
                  "cs-p4v-event": "Commit Event"
                }
            };
            p4vTranslator.canTranslate(request).should.equal(true);
        });
    });

    describe('with incorrect headers', function() {

        it('canTranslate should return false when invalid headers information is present', function() {
            var request = {
                'headers': {
                  "OTHERHEADER": "Commit Event"
                }
            };
            p4vTranslator.canTranslate(request).should.equal(false);
        });
    });

    describe('with valid body', function() {
        uuidStub.returns(1234);
        var expected = [{
            eventId: 1234,
            eventType: 'P4VCommitReceived',
            data: {
                "sha": "r#:53",
                "commit": {
                    "author": {
                        "name": "admin",
                        "email": ""
                    },
                    "committer": {
                        "name": "admin",
                        "email": "",
                        "date": "2016-07-21 08:08:00 +1300 (Thu, 21 Jul 2016)"
                    },
                    "message": "delete file"
                },
                "html_url": "http://v1commitstream.cloudapp.net:9090/!/#ProjectA/commit/r8",
                "repository": {
                    "url": "http://v1commitstream.cloudapp.net:9090/svn/ProjectA",
                    "name": "ProjectA"
                },
                "branch": "",
                "originalMessage": {
                    "author":  "admin",
                    "message":  "delete file",
                    "repository":  "http://v1commitstream.cloudapp.net:9090/svn/ProjectA",
                    "pretext":  "Commit completed:  rev. 8",
                    "committer":  {
                        "name":  "admin",
                        "date":  "2016-07-21 08:08:00 +1300 (Thu, 21 Jul 2016)"
                    },
                    "revision": "53",
                    "html_url":  "http://v1commitstream.cloudapp.net:9090/!/#ProjectA/commit/r8",
                    "changes":  [
                        "... //pablo.txt delete"
                    ]
                }
            },
            metadata: {
                instanceId: '111',
                digestId: '222',
                inboxId: '333'
            }
        }];

        it('returns the expected object', function() {
            var actual = p4vTranslator.translatePush(commit, '111', '222', '333');
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

                p4vTranslator.translatePush(malformedPushEvent, instanceId, digestId, inboxId)
            }
        });

        it('should throw P4vCommitMalformedError', function() {
            invokeTranslatePush.should.throw(P4vCommitMalformedError);
        });

    });

});