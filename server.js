var express = require('express'),
    app = express(),
    cors = require('cors'),
    port = process.env.PORT || 80;

app.get('/version', function(req, res) {
    res.json({version:"0.0.0"});
});

app.use(cors());

app.use(function(req, res, next) {
    res.setHeader("X-API-Docs", "https://github.com/eventstore/eventstore/wiki");
    return next();
});

app.use(express.static(__dirname + '/client'));

app.listen(port, function () {
    console.log('CommitStream Web Server listening on port ' + port);
});
