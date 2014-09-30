(function() {
    var protocol = "//";
    // Put a commitStream object in the global space    
    if (!window.CommitStream) {
        window.CommitStream = {};
        window.CommitStream.commitsDisplay = function(commitStreamDomId, assetNumber) {
            $.getScript(protocol + "cdnjs.cloudflare.com/ajax/libs/require.js/2.1.14/require.min.js", function(data, status, jqxhr) {
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
                require(['assetDetailCommits'], function(assetDetailCommits) {
                    assetDetailCommits(commitStreamDomId, assetNumber);
                });
            });
        };
    } else {
        window.CommitStream.commitsDisplay = function(commitStreamDomId, assetNumber) {
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
            require(['assetDetailCommits'], function(assetDetailCommits) {
                assetDetailCommits(commitStreamDomId, assetNumber);
            });
        }
    }
})();