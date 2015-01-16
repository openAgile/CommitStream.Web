//importController
(function(importController) {
  var gh = require('./helpers/github'),
    bodyParser = require('body-parser'),
    config = require('../config'),
    EventStore = require('eventstore-client');

  importController.init = function(app) {

    app.post('/api/importHistory', bodyParser.json(), function(req, res) {
      var owner = req.body.owner;
      var accessToken = req.body.accessToken;
      var repo = req.body.repo;

      var githubHelper = new gh();
      githubHelper.getAllCommits({
        owner: owner,
        repo: repo,
        accessToken: accessToken
      }, function(events) {
        console.log('Ready to push ' + events.length + ' events.');
        var es = new EventStore({
          baseUrl: config.eventStoreBaseUrl,
          username: config.eventStoreUser,
          password: config.eventStorePassword
        });

        var e = JSON.stringify(events)
        es.streams.post({
          name: 'github-events',
          events: e
        }, function(error, response) {
          console.log(response.statusCode);
        });
      });

      res.json({
        message: 'Your repository has been queued to be imported into CommitStream.'
      });
      res.end();

    });
  };

})(module.exports);