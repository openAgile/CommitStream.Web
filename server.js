var express = require('express'),
    app = express(),
    cors = require('cors'),
    port = process.env.PORT || 80;

app.get('/version', function(req, res) {
    res.json({version:"0.0.0"});
});

app.use(cors());

app.use(express.static(__dirname + '/client'));

app.listen(port, function () {
    console.log('CommitStream Web Server listening on port ' + port);
});
