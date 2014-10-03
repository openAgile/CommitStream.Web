(function (github) {
    var request = require('request');
    var uuid = require('uuid-v4');
    
    var events = [];
    
    github.init = function () {
        events = [];
    }

    github.getAllCommits = function (url, callback) {
        var optionsHttps = {
            url: url,
            headers: {
                "User-Agent": "CommitStream.Web"
            }
        };
        
        request(optionsHttps, function (error, response, body) {
            pileEvents(body, events);
            var repoUrl = getNextLink(response.headers);
            
            if (repoUrl) {
                github.getAllCommits(repoUrl, callback);
            } else {
                callback(events);
            }
        });

    };

    function pileEvents(body) {
        var commits = JSON.parse(body);
        commits.forEach(function (item) {
            var e = {
                eventId: uuid(),
                eventType: 'github-event',
                data: item
            };
            events.unshift(e);
        });
    }
    
    function getNextLink(headers) {
        var result = null;
        if (headers.hasOwnProperty('link')) {
            headers.link.split(',').forEach(function (item) {
                var parts = item.split(';');
                if (parts[1].trim() == 'rel="next"') {
                    result = parts[0].replace('<', '').replace('>', '');
                }
            });
        }
        return result;
    }

}(module.exports));