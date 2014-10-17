var express = require('express'),
    app = express(),
    cors = require('cors'),
    config = require('./config'),
    exphbs = require('express-handlebars');

app.get('/version', function(req, res) {
    res.json({version:"0.0.0"});
});

var api = require("./api");
require('./bootstrapper').boot(config);

// Wire up express-handlebars as the view engine for express.
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


app.use(cors());

// Map API the routes
api.init(app);

app.use(function(req, res, next) {
    res.setHeader("X-CommitStream-API-Docs", "https://github.com/eventstore/eventstore/wiki");
    return next();
});


function assertApiKeyValid(req, res) {
    if (!config.apiKey || (!req.query.key || !req.query.key == config.apiKey)) {
        res.status(403).send('API key parameter missing or invalid');
        return false;
    }
    return true;
}

app.get('/app', function(req, res) {
    if (!assertApiKeyValid(req, res)) return;
    res.setHeader('content-type', 'application/javascript');
    var protocol = req.protocol;
    var host = req.get('host');

    res.render('app', {
        apiUrl: protocol + '://' + host + '/api/query?workitem=',
        templateUrl: protocol + '://' + host + '/assetDetailCommits.html',
        resourcePath: protocol + '://' + host + '/'
    });
});

app.get('/instances', function(req, res) {
    res.render('instances');
});

app.use(express.static(__dirname + '/client'));

app.listen(config.port, function () {
    console.log('CommitStream Web Server listening on port ' + config.port);
});