//importController
(function (importController) {
  var gh = require('./helpers/github'),
      bodyParser = require('body-parser'),
      config = require('../config'),
      eventStore = require('./helpers/eventStore');
  
  importController.init = function (app) {
    
    app.post('/api/importHistory', bodyParser.json(), function (req, res) {
      var owner = req.body.owner;
      var accessToken = req.body.accessToken;
      var repo = req.body.repo;
      
      var githubHelper = new gh();
      githubHelper.getAllCommits({
        owner: owner,
        repo: repo,
        accessToken: accessToken
      }, function (events) {
        console.log('Ready to push ' + events.length + ' events.');
        var es = new eventStore(config.eventStoreBaseUrl, config.eventStoreUser, config.eventStorePassword);
        es.pushEvents(JSON.stringify(events), function (error, response) {
          console.log(response.statusCode);
        });
      });
      res.json({ message: 'Your repository has been queued to be imported into CommitStream.' });
      res.end();
    });
    
    app.post('/api/listenerWebhook', bodyParser.json(), function (req, res) {
      res.set('Content-Type', 'application/json');
      //TODO: all this logic, yikes!
      if (!req.headers.hasOwnProperty('x-github-event')) {
        res.json({ message: 'Unknown event type.' });
      } else if (req.headers['x-github-event'] == 'push') {
        
        var translator = require('./translators/githubTranslator');
        var events = translator.translatePush(req.body);
        var es = new eventStore(config.eventStoreBaseUrl, config.eventStoreUser, config.eventStorePassword);
        
        es.pushEvents(JSON.stringify(events), function (error, response, body) {
          if (error) {
            console.log(error);
          } else {
            console.log('Posted to eventstore.');
            console.log(response.statusCode);
          }
        });
        res.json({ message: 'Your push event is in queue to be added to CommitStream.' });
        
      } else if (req.headers['x-github-event'] == 'ping') {
        res.json({ message: 'Pong.' });
      } else {
        res.json({ message: 'Unknown event type.' });
      }
      res.end();
    });

  };

})(module.exports);