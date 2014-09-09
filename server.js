var bodyParser = require('body-parser');
var request = require('request');
var express = require('express');
var app = express();
var cors = require('cors');

app.use(bodyParser.text({ type : 'application/xml' }));
app.use(cors());

var port = Number(process.env.PORT || 5000);

app.use(express.static(__dirname + '/client'));

app.listen(port, function () {
    console.log('CommitStream Web Server listening on port ' + port);
});
