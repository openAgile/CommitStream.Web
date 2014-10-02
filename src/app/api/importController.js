//importController
(function (importController) {
    var helpers = require("./helpers");
    var config = require("../config");
    var request = require('request');
    var uuid = require('uuid-v4');
    
    importController.init = function (app) {
        
        app.get("/api/continuingImporting", function (req, res) {
            
            var owner = req.query.owner;
            var accessToken = req.query.accessToken;
            var repo = req.query.repo;
            
            var eventStoreUrl = config.eventStoreProtocol + 
            '://' + config.eventStoreHost + 
            ':' + config.eventStorePort + 
            '/streams/repo-' + owner + '-' + repo + '/head?embed=content';
            
            var options = {
                url: eventStoreUrl,            
                headers: {
                    'Accept': 'application/json'                   
                }
            };
            
            request.get(options, function (error, response, body) {
                console.log('Getting the last commit for this repository');
                if (response.statusCode == 404) {
                    res.end('Stream not found, You need to do a full import');
                }
                if (response.statusCode == 200) {
                    var date = JSON.parse(body).commit.committer.date;
                    var repoUrl =  "https://api.github.com/repos/" + owner + "/" + repo + '/commits?since=' + date + '&per_page=100&page=1&access_token=' + accessToken;                    
                    var events = [];
                    makeRequest(repoUrl, events, pushToEventStorePartial);
                    res.end('Your repository is in queue to be updated.');
                }
            });           

        });
        
        app.get("/api/historicalImport", function (req, res) {
            var owner = req.query.owner;
            var accessToken = req.query.accessToken;
            var repo = req.query.repo;
            
            var repoUrl = "https://api.github.com/repos/" + owner + "/" + repo + '/commits?per_page=100&page=1&access_token=' + accessToken;
            
            var events = [];            
            makeRequest(repoUrl, events, pushToEventStore);
            
            res.end('Your repository is in queue to be added to CommitStream.');
        });
        
        function makeRequest(url, events, callback) {
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
                    makeRequest(repoUrl, events);
                } else {
                    callback(events);
                }
            });
            
        };
        
        function pileEvents(body, events) {
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
        
        function pushToEventStore(events) {
            var content = JSON.stringify(events);
            var eventStoreUrl = config.eventStoreProtocol + 
            '://' + config.eventStoreHost + 
            ':' + config.eventStorePort + 
            '/streams/github-events';

            var options = {
                url: eventStoreUrl,
                body: content,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': "application/vnd.eventstore.events+json",
                    'Content-Length': content.length,
                    'Authorization': 'Basic YWRtaW46Y2hhbmdlaXQ='
                }
            };
            
            request.post(options, function (error, response, body) {
                console.log('Posted to eventstore.');
                console.log(response.statusCode);
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

        function pushToEventStorePartial(events) {
            events.shift();
            pushToEventStore(events);
        }

    };
})(module.exports);