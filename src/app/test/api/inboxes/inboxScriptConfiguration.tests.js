require('../handler-base')();
var InboxScriptRetrievedError = require('../../../middleware/inboxScriptRetrievedError');

// Set up proxyquire for mocking/spying/stubbing.
var fsStub = {
    readFile: sinon.stub()
}

var handler = proxyquire('../../api/inboxes/inboxScriptConfiguration', {
   fs: fsStub
});
// End Set up proxyquire for mocking/spying/stubbing.

function createRequest() {
    var request = httpMocks.createRequest();
    request = {
        inbox: {
            family: "Svn"
        },
        query: {
            platform: "windows"
        }
    }
    return request;
}

function createResponse() {
    var response = httpMocks.createResponse();
    return response;
}

describe('inboxScriptConfiguration', function() {
    var request;
    var response;

    describe('when getting an inbox script for Svn', function() {
        before(function() {
            request = createRequest();
            response = createResponse();
            handler(request, response);
        });

        it('should try to send an Svn script file', function() {
            fsStub.readFile.should.have.been.calledOnce;
        });

        it('should call readFile with correct args', function() {
            fsStub.readFile.should.have.been.calledWith("./api/inboxes/resources/commit-event.ps1", "utf8", sinon.match.func);
        });
    });

    describe('inboxScriptConfigurationError', function() {
    var request;
    var response;

        describe('when getting an inbox script for Svn', function() {
            before(function() {
                request = createRequest();
                response = createResponse();
                fsStub.readFile.callsArgWith(2, 222, null);
            });           

            it('should raise an exception', function(done) {
                var invokeTranslator = function() {
                    handler(request, response);
                }
                invokeTranslator.should.throw(InboxScriptRetrievedError);
                done();
            });
        });
    });
});