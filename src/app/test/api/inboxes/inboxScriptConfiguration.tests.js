require('../handler-base')();

// Set up proxyquire for mocking/spying/stubbing.
var scriptFileSender = {
    sendSvnScriptFile: sinon.spy()
};

var handler = proxyquire('../../api/inboxes/inboxScriptConfiguration', {
   '../helpers/scriptFileSender': scriptFileSender
});
// End Set up proxyquire for mocking/spying/stubbing.

function createRequest() {
    var request = httpMocks.createRequest();
    request.inbox = {
        family: "Svn"
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
           scriptFileSender.sendSvnScriptFile.should.have.been.calledOnce;
        });
    });
});