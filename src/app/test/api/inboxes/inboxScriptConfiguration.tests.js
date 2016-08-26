require('../handler-base')();
var InboxScriptRetrievedError = require('../../../middleware/inboxScriptRetrievedError');
var InboxHasNoScriptError = require('../../../middleware/inboxHasNoScriptError');
var InboxScriptBadPlatformRequestedError = require('../../../middleware/inboxScriptBadPlatformRequestedError');

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
            family: "Svn",
            name: "Name"
        },
        instance: {
            instanceId: 'id'
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

        it('should call readFile with correct args', function() {
            fsStub.readFile.should.have.been.calledWith("./api/inboxes/resources/commit-event.ps1", "utf8", sinon.match.func);
        });
    });

    describe('when we are requesting a windows script for svn family', function() {
        var request;
        var response;

        // Be careful in modifying these variables as there is quite a bit of escaping going on.
        var expectedFileContentForWindows = `# Requires Powershell 3.0 #The next 4 line should be added in post-commit.bat file under hooks folder #SET REPOS=%1 #SET REV=%2 #SET DIR=%REPOS%/hooks #Powershell.exe -executionpolicy remotesigned -File  %DIR%/commit-event.ps1 %REPOS% %REV% Param( [string]$svnPath, [string]$revision ) $repository = "Name" $html_url = "PLACE BASE URL TO INSPECT YOUR REVISIONS" $endpoint = "http://google.com" $headers = @{"CS-SVN-Event"="Commit Event"} $log = (svnlook log -r $revision $svnPath) $who = (svnlook author -r $revision $svnPath) $when = (svnlook date -r $revision $svnPath) $changes = (svnlook changed -r $revision $svnPath) $payload = @{ pretext = "Commit completed: $repoName rev. $revision" author = "$who" committer = @{ name = "$who" date = "$when" } revision = "$revision" message = "$log" repository = "$repository" html_url = "$($html_url)$($revision)" changes = @($changes) } $json = (ConvertTo-Json $payload -Depth 99) Invoke-RestMethod -H $headers -Uri $endpoint -Method Post -ContentType "application/json" -Body $json`;
        var fileContentForWindows =         `# Requires Powershell 3.0 #The next 4 line should be added in post-commit.bat file under hooks folder #SET REPOS=%1 #SET REV=%2 #SET DIR=%REPOS%/hooks #Powershell.exe -executionpolicy remotesigned -File  %DIR%/commit-event.ps1 %REPOS% %REV% Param( [string]$svnPath, [string]$revision ) $repository = "PLACE REPO URL HERE" $html_url = "PLACE BASE URL TO INSPECT YOUR REVISIONS" $endpoint = "PLACE INBOX URL HERE" $headers = @{"CS-SVN-Event"="Commit Event"} $log = (svnlook log -r $revision $svnPath) $who = (svnlook author -r $revision $svnPath) $when = (svnlook date -r $revision $svnPath) $changes = (svnlook changed -r $revision $svnPath) $payload = @{ pretext = "Commit completed: $repoName rev. $revision" author = "$who" committer = @{ name = "$who" date = "$when" } revision = "$revision" message = "$log" repository = "$repository" html_url = "$($html_url)$($revision)" changes = @($changes) } $json = (ConvertTo-Json $payload -Depth 99) Invoke-RestMethod -H $headers -Uri $endpoint -Method Post -ContentType "application/json" -Body $json`;
        before(function() {
            request = createRequest();
            response = createResponse();
            request.href = sinon.stub().returns("http://google.com");
            response.end = sinon.spy();
            var indexToFunctionToBeStub = 2;
            var firstFunctionArgument = null;
            //Documentation about this at: http://sinonjs.org/docs/
            //look for stub.callsArgOnWith(index, context, arg1, arg2, ...);
            fsStub.readFile.callsArgWith(indexToFunctionToBeStub, firstFunctionArgument, fileContentForWindows);
            handler(request, response);
        });           

        it('should send the expected file content result', function(done) {
            response.end.should.have.been.calledWith(expectedFileContentForWindows);
            done();
        });
    });

    describe('when we are requesting a linux script for svn family', function() {
        var request;
        var response;

        // Be careful in modifying these variables as there is quite a bit of escaping going on.
        var expectedFileContentForLinux = `#!/bin/bash #The next 3 line should be added in post-commit file under hooks folder #REPOS="$1" #REV="$2" #"$REPOS"/hooks/commit-event.sh "$REPOS" "$REV" # BASH 4.0 or higher is required # THIS IS SO WE CAN USE MAPFILE SVNPATH="$1" REVISION="$2" REPOSITORY="Name" HTML_URL="PLACE BASE URL TO INSPECT YOUR REVISIONS" ENDPOINT="http://google.com" COMMITEVENTHEADER="CS-SVN-Event:Commit Event" APPJSONHEADER="Content-Type:application/json" svnlook="/usr/bin/svnlook" svn="/usr/bin/svn" LOG=\`$svnlook log -r $REVISION $SVNPATH\` WHO=\`svnlook author -r $REVISION $SVNPATH\` WHEN=\`svnlook date -r $REVISION $SVNPATH\` CHANGES=\`svnlook changed -r $REVISION $SVNPATH\` mapfile -t array <<< "$CHANGES" for element in "$\{array[@]\}" do CHANGESFORJSON+=""$\{element\}"," done CHANGESFORJSON="$\{CHANGESFORJSON::-1\}" PAYLOAD='\{"pretext":"Commit completed: rev. '"$REVISION"'","committer":\{"name":"'"$WHO"'","date":"'"$WHEN"'"\},"author":"'"$WHO"'","revision":"'"$REVISION"'","message":"'"$LOG"'","changes":['"$CH$ curl -X POST -H "$COMMITEVENTHEADER" -H "$APPJSONHEADER" --data "$PAYLOAD" "$ENDPOINT"`;
        var fileContentForLinux = `#!/bin/bash #The next 3 line should be added in post-commit file under hooks folder #REPOS="$1" #REV="$2" #"$REPOS"/hooks/commit-event.sh "$REPOS" "$REV" # BASH 4.0 or higher is required # THIS IS SO WE CAN USE MAPFILE SVNPATH="$1" REVISION="$2" REPOSITORY="PLACE REPO URL HERE" HTML_URL="PLACE BASE URL TO INSPECT YOUR REVISIONS" ENDPOINT="PLACE INBOX URL HERE" COMMITEVENTHEADER="CS-SVN-Event:Commit Event" APPJSONHEADER="Content-Type:application/json" svnlook="/usr/bin/svnlook" svn="/usr/bin/svn" LOG=\`$svnlook log -r $REVISION $SVNPATH\` WHO=\`svnlook author -r $REVISION $SVNPATH\` WHEN=\`svnlook date -r $REVISION $SVNPATH\` CHANGES=\`svnlook changed -r $REVISION $SVNPATH\` mapfile -t array <<< "$CHANGES" for element in "$\{array[@]\}" do CHANGESFORJSON+=\""$\{element\}\"," done CHANGESFORJSON="$\{CHANGESFORJSON::-1\}" PAYLOAD='\{"pretext":"Commit completed: rev. '"$REVISION"'","committer":\{"name":"'"$WHO"'","date":"'"$WHEN"'"\},"author":"'"$WHO"'","revision":"'"$REVISION"'","message":"'"$LOG"'","changes":['"$CH$ curl -X POST -H "$COMMITEVENTHEADER" -H "$APPJSONHEADER" --data "$PAYLOAD" "$ENDPOINT"`;
        before(function() {
            request = createRequest();
            response = createResponse();
            request.query.platform = "linux";
            request.href = sinon.stub().returns("http://google.com");
            response.end = sinon.spy();
            var indexToFunctionToBeStub = 2;
            var firstFunctionArgument = null;
            //Documentation about this at: http://sinonjs.org/docs/
            //look for stub.callsArgOnWith(index, context, arg1, arg2, ...);
            fsStub.readFile.callsArgWith(indexToFunctionToBeStub, firstFunctionArgument, fileContentForLinux);
            handler(request, response);
        });           

        it('should send the expected file content result', function(done) {
            response.end.should.have.been.calledWith(expectedFileContentForLinux);
            done();
        });
    });    

    describe('InboxScriptConfigurationError', function() {
    var request;
    var response;

        describe('when getting an inbox script for Svn and there is an error reading it', function() {
            before(function() {
                request = createRequest();
                response = createResponse();
                var indexToFunctionToBeStub = 2;
                var firstFunctionArgument = "someError";
                var secondFunctionArgument = null;
                //Documentation about this at: http://sinonjs.org/docs/
                //look for stub.callsArgOnWith(index, context, arg1, arg2, ...);
                fsStub.readFile.callsArgWith(indexToFunctionToBeStub, firstFunctionArgument, secondFunctionArgument);
            });           

            it('should raise an InboxScriptRetrievedError', function(done) {
                var invokeHandler = function() {
                    handler(request, response);
                }
                invokeHandler.should.throw(InboxScriptRetrievedError);
                done();
            });
        });
    });

    describe('InboxHasNoScriptError', function() {
    var request;
    var response;

        describe('when getting an inbox script for a non Svn family', function() {
            before(function() {
                request = createRequest();
                response = createResponse();
                request.inbox.family = "notSvn";
            });           

            it('should raise an InboxHasNoScriptError', function(done) {
                var invokeHandler = function() {
                    handler(request, response);
                }
                invokeHandler.should.throw(InboxHasNoScriptError);
                done();
            });
        });
    });

    describe('InboxScriptBadPlatformRequestedError', function() {
    var request;
    var response;

        describe('when getting an inbox script for an Svn family but for not the windows or linux platform', function() {
            beforeEach(function() {
                request = createRequest();
                response = createResponse();
                request.query.platform = "notWindowsOrLinux";                
            });           

            it('should raise an InboxScriptBadPlatformRequestedError', function(done) {
                var invokeHandler = function() {
                    handler(request, response);
                }
                invokeHandler.should.throw(InboxScriptBadPlatformRequestedError);
                done();
            });
        });
    });
});