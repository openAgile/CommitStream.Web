(function() {
    var protocol = "//";

    function configureCommitStreamDependencies() {
        require.config({
            paths: {
                moment: protocol + 'cdnjs.cloudflare.com/ajax/libs/moment.js/2.8.2/moment.min',
                handlebars: protocol + 'cdnjs.cloudflare.com/ajax/libs/handlebars.js/2.0.0-alpha.4/handlebars.amd.min'
            },
            config: {
                moment: {
                    noGlobal: true
                }
            }
        });
    }

    function queryCommitStream(commitStreamDomId, workitem, handlebars) {
        var apiUrl = 'http://localhost:6565/api/query?workitem=' + workitem;
        $.getJSON(apiUrl).done(function(data) {
            if (data.commits.length > 0) {
                $.get("http://localhost:6565/assetDetailCommits.html").done(function(source) {
                    var template = handlebars.compile(source);
                    var content = template(data);
                    $(commitStreamDomId).html(content);
                });
            }
        });
    }

    function invokeCommitStream(commitStreamDomId, workitem) {
        require(['moment', 'handlebars'], function(moment, handlebars) {
            queryCommitStream(commitStreamDomId, workitem, handlebars.default);
        });
    }

    // Put a commitStream object in the global space
    if (!window.CommitStream) {
        window.CommitStream = {
            commitsDisplay : function(commitStreamDomId, workitem) {
                $.getScript(protocol + "cdnjs.cloudflare.com/ajax/libs/require.js/2.1.14/require.min.js", function(data, status, jqxhr) {
                    configureCommitStreamDependencies();
                    invokeCommitStream(commitStreamDomId, workitem);
                });
            }
        };
    } else {
        window.CommitStream.commitsDisplay = invokeCommitStream;
    }
})();