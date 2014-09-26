var express = require('express'),
    app = express(),
    cors = require('cors'),
    port = process.env.PORT || 6565;

app.get('/version', function(req, res) {
    res.json({version:"0.0.0"});
});

var api = require("./api");

//Map the routes
api.init(app);

app.use(cors());

app.use(function(req, res, next) {
    res.setHeader("X-CommitStream-API-Docs", "https://github.com/eventstore/eventstore/wiki");
    return next();
});

app.use(express.static(__dirname + '/client'));

app.listen(port, function () {
    console.log('CommitStream Web Server listening on port ' + port);
});
