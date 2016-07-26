var chai = require('chai'),
    should = chai.should(),
    proxyquire = require('proxyquire'),
    sinon = require('sinon'),
    uuidStub = sinon.stub(),
    svnTranslator = proxyquire('../../../api/translators/svnTranslator', {
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
    "html_url":  "http://v1commitstream.cloudapp.net:9090/!/#ProjectA/commit/r8",
    "changes":  [
                    "D   pablo.txt"
                ]
}

describe('svnTranslator', function() {

    describe('with appropriate body', function() {

        it('canTranslate should return true when valid header information is present', function() {
            var request = {
                'headers': {
                  "cs-svn-event": "Commit Event"
                }
            };
            svnTranslator.canTranslate(request).should.equal(true);
        });
    });

    describe('with incorrect headers', function() {

        it('canTranslate should return false when invalid headers information is present', function() {
            var request = {
                'headers': {
                  "OTHERHEADER": "Commit Event"
                }
            };
            svnTranslator.canTranslate(request).should.equal(false);
        });
    });

    describe('with valid body', function() {
        uuidStub.returns(1234);
        var expected = [{
            eventId: 1234,
            eventType: 'SvnCommitReceived',
            data: {
                "sha": "r8",
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
                    "html_url":  "http://v1commitstream.cloudapp.net:9090/!/#ProjectA/commit/r8",
                    "changes":  [
                                    "D   pablo.txt"
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
            var actual = svnTranslator.translatePush(commit, '111', '222', '333');
            actual.should.deep.equal(expected);
        });
    });

    describe('with invalid body', function() {

        var invokeTranslatePush = function() {
            svnTranslator.translatePush({}, '111', '222', '333')
        }
        invokeTranslatePush.should.throw(svnTranslator.SvnCommitMalformedError);
    });

});