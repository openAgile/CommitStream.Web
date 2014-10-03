var express = require('express'),
    app = express(),
    cors = require('cors'),
    config = require('./config');

app.get('/version', function(req, res) {
    res.json({version:"0.0.0"});
});

var api = require("./api");
require('./bootstrapper').boot(config);

app.use(cors());

// Map API the routes
api.init(app);

app.use(function(req, res, next) {
    res.setHeader("X-CommitStream-API-Docs", "https://github.com/eventstore/eventstore/wiki");
    return next();
});

app.get('/config.json', function(req, res) {
	var clientConfig = {
		assetDetailTemplateUrl : config.assetDetailTemplateUrl
	};
	res.json(clientConfig);
});

app.use(express.static(__dirname + '/client'));

app.listen(config.port, function () {
    console.log('CommitStream Web Server listening on port ' + config.port);
});