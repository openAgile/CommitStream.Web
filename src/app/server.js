var express = require('express'),
  app = express(),
  cors = require('cors'),
  config = require('./config'),
  apikey = require('./apikey'),
  exphbs = require('express-handlebars');

app.get('/version', function(req, res) {
  res.json({
    version: "0.0.0"
  });
});

var api = require("./api");
//require('./bootstrapper').boot(config);

// Wire up express-handlebars as the view engine for express.
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// NOTE: Do not rearrange the order of these app.* statements becaused they
// are crucial for the order of operations in the pipeline of middleware
// functions!
app.use(cors());

app.use(express.static(__dirname + '/client'));

app.get('/instances', function(req, res) {
  res.render('instances');
});

// NOTE: See above warning. Why are you even considering moving these?
// Think thrice.
app.use(apikey);

app.use(function(req, res, next) {
  res.setHeader("X-CommitStream-API-Docs", "https://github.com/openAgile/CommitStream.Web");
  return next();
});

// Map API the routes
api.init(app);

app.get('/app', function(req, res) {
  res.setHeader('content-type', 'application/javascript');
  var protocol = config.protocol || req.protocol;
  var host = req.get('host');
  var key = req.query.key;

  res.render('app', {
    apiUrl: protocol + '://' + host + '/api/query?key=' + key + '&workitem=',
    templateUrl: protocol + '://' + host + '/assetDetailCommits.html',
    resourcePath: protocol + '://' + host + '/'
  });
});

app.listen(config.port, function() {
  console.log('CommitStream Web Server listening on port ' + config.port);
});