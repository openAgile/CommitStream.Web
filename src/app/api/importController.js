//importController
(function (importController) {
    var helpers = require("./helpers");
    var config = require("../config");
    var request = require('request');
    var uuid = require('uuid-v4');
    
    importController.init = function (app) {
        
        app.get("/api/continuingImporting", function (req, res) {
            
            var urlRepo = "/repos/" + req.query.owner + "/" + req.query.repo;
            
            var options = {
                host: config.eventStoreHost,
                port: config.eventStorePort,
                path: '/streams/github-events/head?embed=content',
                headers: {
                    'Accept': 'application/json'
                }
            };
            
            helpers.getHttpResources(options, function (err, response) {
                var date = response.commit.committer.date;
                var commistUrl = urlRepo + "/commits?since=" + date;
                var optionsHttps = {
                    host: 'api.github.com',
                    path: commistUrl,
                    headers: {
                        "User-Agent": "test"
                    }
                };
                
                helpers.getHttpsResources(optionsHttps, function (err, response) {
                    res.set("Content-Type", "application/json");
                    res.send(response);
                });

            });

        });
        
        app.get("/api/historicalImport", function (req, res) {
            var owner = req.query.owner;
            var accessToken = req.query.accessToken;
            var repo = req.query.repo;
            
            var repoUrl = "/repos/" + owner + "/" + repo + '/commits?per_page=100&page=1&access_token=' + accessToken;
            
            var events = [];            
            makeRequest(repoUrl, events);
            
            res.end('Your repository is in queue to be added to CommitStream.');
        });
        
        function makeRequest(url, events) {
            var optionsHttps = {
                url: 'https://api.github.com' + url,
                headers: {
                    "User-Agent": "CommitStream.Web"
                }
            };

            request(optionsHttps, function (error, response, body) {
                pileEvents(body, events);
                var repoUrl = getNextLink(response.headers);
                
                if (repoUrl) {
                    makeRequest(repoUrl);
                } else {
                    pushToEventStore(events);
                }
            });
            
        };
        
        function pileEvents(body, events) {
            var commits = JSON.parse(body);
            commits.forEach(function (item) {
                //var guid = uuid();
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
                    var part = item.split(';');
                    if (part[1] == 'rel="next"') {
                        result = parts[0].replace('<', '').replace('>', '');
                    }
                });
            }
            return result;
        }

    };
})(module.exports);