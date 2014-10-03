//importController
(function (importController) {
    var config = require("../config");
    var request = require('request');
    var es = require('./helpers/eventStore');
    var bodyParser = require('body-parser');
    
    importController.init = function (app) {
        
        app.post("/api/continuingImporting", bodyParser.json(), function (req, res) {
            
            var owner = req.body.owner;
            var accessToken = req.body.accessToken;
            var repo = req.body.repo;
            
            es.getLastCommit(owner, repo, function (err, event) {
                if (err) {
                    res.end(err);
                } else {
                    var date = JSON.parse(event).commit.committer.date;
                    var repoUrl = "https://api.github.com/repos/" + owner + "/" + repo + '/commits?since=' + date + '&per_page=100&page=1&access_token=' + accessToken;
                    var github = require("./helpers/github");
                    github.init();
                    github.getAllCommits(repoUrl, function (events) {
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
            github.init();
            github.getAllCommits(repoUrl, function(events) {
                var content = JSON.stringify(events);
                es.pushEvents(content);
            });
            
            res.end('Your repository is in queue to be added to CommitStream.');
        });

    };
})(module.exports);