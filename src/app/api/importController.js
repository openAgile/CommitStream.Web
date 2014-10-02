//importController
(function (importController) {
    var config = require("../config");
    var request = require('request');
    
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
                    var repoUrl = "https://api.github.com/repos/" + owner + "/" + repo + '/commits?since=' + date + '&per_page=100&page=1&access_token=' + accessToken;
                    var github = require("./helpers/github");
                    github.getAllCommits(repoUrl, pushToEventStorePartial);
                    
                    res.end('Your repository is in queue to be updated.');
                }
            });           

        });
        
        app.get("/api/historicalImport", function (req, res) {
            var owner = req.query.owner;
            var accessToken = req.query.accessToken;
            var repo = req.query.repo;
            
            var repoUrl = "https://api.github.com/repos/" + owner + "/" + repo + '/commits?per_page=100&page=1&access_token=' + accessToken;

            var github = require("./helpers/github");
            github.getAllCommits(repoUrl, pushToEventStore);
            
            res.end('Your repository is in queue to be added to CommitStream.');
        });
        
        
        
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

        function pushToEventStorePartial(events) {
            events.shift();
            pushToEventStore(events);
        }

    };
})(module.exports);