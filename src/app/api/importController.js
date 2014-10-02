//importController
(function (importController) {
    var config = require("../config");
    var request = require('request');
    var es = require('./helpers/eventStore');
    var bodyParser = require('body-parser');
    
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

                    github.getAllCommits(repoUrl, function(events) {
                        events.shift();
                        var content = JSON.stringify(events);
                        es.pushEvents(content);
                    });
                    
                    res.end('Your repository is in queue to be updated.');
                }
            });           

        });
        
        app.post("/api/historicalImport", bodyParser.json(), function (req, res) {
            var owner = req.body.owner;
            var accessToken = req.body.accessToken;
            var repo = req.body.repo;
            
            var repoUrl = "https://api.github.com/repos/" + owner + "/" + repo + '/commits?per_page=100&page=1&access_token=' + accessToken;

            var github = require("./helpers/github");
            github.getAllCommits(repoUrl, function(events) {
                var content = JSON.stringify(events);
                es.pushEvents(content);
            });
            
            res.end('Your repository is in queue to be added to CommitStream.');
        });

    };
})(module.exports);