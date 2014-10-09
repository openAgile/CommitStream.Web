(function (settingsController) {
    var config = require('../config'),
        request = require('request'),
        bodyParser = require('body-parser'),
        JsonDB = require('node-json-db');

    var db = new JsonDB('instances', true, true);        

    var defaultSettings = {
        'CommitStream.Availability': 'unavailable',
        'CommitStream.Toggle': 'off',
        'CommitStream.AppUrl': 'http://v1commitstream-staging.azurewebsites.net/app.js'
    };

    settingsController.init = function (app) {

        app.get('/api/settings', function(req, res) {
            var instance = req.query.instance;
            if (!instance) {
                res.end(defaultSettings);
            }
            try {
                var settings = db.getData('/' + instance);
                res.end(JSON.stringify(settings));
            } catch (ex) {
                res.end(JSON.stringify(defaultSettings));
            }
        });
        
        app.post('/api/settings', bodyParser.json(), function(req, res) {
            var instance = req.query.instance;
            if (!instance) {
                res.end('No instance sent');
            }
            var settings = null;
            var exists = false;
            try {
                settings = db.getData('/' + instance);
                exists = true;
            } catch(ex) {
                settings = JSON.parse(JSON.stringify(defaultSettings));
            }
            for(var prop in req.body) {
                settings[prop] = req.body[prop];
            }
            if (exists) {
                db.save();
            } else {
                db.push('/' + instance, settings);
            }
            res.end("saved");
        });
    };
})(module.exports);