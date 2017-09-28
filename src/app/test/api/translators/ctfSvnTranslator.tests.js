var chai = require('chai'),
    should = chai.should(),
    proxyquire = require('proxyquire'),
    sinon = require('sinon'),
    uuidStub = sinon.stub(),
    CtfSvnCommitMalformedError = require('../../../middleware/ctfSvnCommitMalformedError'),
    ctfSvnTranslator = proxyquire('../../../api/translators/ctfSvnTranslator', {
        'uuid-v4': uuidStub
    });

require('../../helpers')(global);

var commit = {
    "event_type": "post-commit",
    "project": {
        "name": "CollabNet Desktop",
        "id": "proj1010",
        "url": "https://ctf.open.collab.net/sf/go/proj1010"
    },
    "repository": {
        "full_name": ".NET Desktops",
        "name": "dotnet",
        "description": "Windows, Visual Studio and Outlook Desktops",
        "id": "reps1900",
        "type": "subversion",
        "url": "https://ctf.open.collab.net/sf/scm/do/viewRepositorySource/projects.desktop/scm.NET_Desktops"
      },
    "revision": {
        "changed_paths": {
            "modified": [
              "trunk/www/index.html"
            ]
          },
        "author": {
            "name": "Full Name",
            "email": "uname@teamforge.org",
            "username": "uname"
          },
        "id": "372",
        "message": "Update title for project pages",
        "url": "https://ctf.open.collab.net/integration/viewvc/viewvc.cgi?view=revision&root=dotnet&system=exsy1005&revision=372",
        "timestamp": "2015-08-18T18:43:11+00:00"
      }
}

describe('ctfSvnTranslator', function() {

    describe('with appropriate body', function() {

        it('canTranslate should return true when valid header information is present', function() {
            var request = {
                'headers': {
                  "x-ctf-scm": "subversion"
                }
            };
            ctfSvnTranslator.canTranslate(request).should.equal(true);
        });
    });

    describe('with incorrect headers', function() {

        it('canTranslate should return false when invalid headers information is present', function() {
            var request = {
                'headers': {
                  "OTHERHEADER": "Commit Event"
                }
            };
            ctfSvnTranslator.canTranslate(request).should.equal(false);
        });
    });

    describe('with invalid header value', function() {

        it('canTranslate should return false with invalid header value', function() {
            var request = {
                'headers': {
                  "x-ctf-scm": "scm"
                }
            };
            ctfSvnTranslator.canTranslate(request).should.equal(false);
        });
    });

    describe('with valid body', function() {
        uuidStub.returns(1234);
        var expected = [{
            eventId: 1234,
            eventType: 'CtfSvnCommitReceived',
            data: {
                "sha": "r372",
                "commit": {
                    "author": {
                        "name": "Full Name",
                        "email": "uname@teamforge.org"
                    },
                    "committer": {
                        "name": "Full Name",
                        "email": "uname@teamforge.org",
                        "date": "2015-08-18T18:43:11+00:00"
                    },
                    "message": "Update title for project pages"
                },
                "html_url": "https://ctf.open.collab.net/integration/viewvc/viewvc.cgi?view=revision&root=dotnet&system=exsy1005&revision=372",
                "repository": {
                    "id": "reps1900",
                    "name": "dotnet",
                    "url": "https://ctf.open.collab.net/sf/scm/do/viewRepositorySource/projects.desktop/scm.NET_Desktops"
                },
                "branch": "",
                "originalMessage": {
                    "event_type": "post-commit",
                    "project": {
                        "name": "CollabNet Desktop",
                        "id": "proj1010",
                        "url": "https://ctf.open.collab.net/sf/go/proj1010"
                    },
                    "repository": {
                        "full_name": ".NET Desktops",
                        "name": "dotnet",
                        "description": "Windows, Visual Studio and Outlook Desktops",
                        "id": "reps1900",
                        "type": "subversion",
                        "url": "https://ctf.open.collab.net/sf/scm/do/viewRepositorySource/projects.desktop/scm.NET_Desktops"
                      },
                    "revision": {
                        "changed_paths": {
                            "modified": [
                                "trunk/www/index.html"
                              ]
                          },
                        "author": {
                            "name": "Full Name",
                            "email": "uname@teamforge.org",
                            "username": "uname"
                          },
                        "id": "372",
                        "message": "Update title for project pages",
                        "url": "https://ctf.open.collab.net/integration/viewvc/viewvc.cgi?view=revision&root=dotnet&system=exsy1005&revision=372",
                        "timestamp": "2015-08-18T18:43:11+00:00"
                      }
                  }
              },
              metadata: {
                  instanceId: '111',
                  digestId: '222',
                  inboxId: '333'
                }
        }];
        it('returns the expected object', function() {
            var actual = ctfSvnTranslator.translatePush(commit, '111', '222', '333');
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

                ctfSvnTranslator.translatePush(malformedPushEvent, instanceId, digestId, inboxId)
            }
        });

        it('should throw CtfSvnCommitMalformedError', function() {
            invokeTranslatePush.should.throw(CtfSvnCommitMalformedError);
        });

    });

});