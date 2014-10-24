(function (settingsController) {
    var config = require('../config'),
        request = require('request'),
        bodyParser = require('body-parser'),
        JsonDB = require('node-json-db');

    var db = new JsonDB('instances', true, true);        

    function getDefaultSettings() {
        return {
            'CommitStream.Availability': 'unavailable',
            'CommitStream.Toggle': 'off',
            'CommitStream.AppUrl': 'http://localhost:6565/app'
        };
    }

    settingsController.init = function (app) {

        app.get('/api/settings', function(req, res) {
            var settings = getDefaultSettings();
            var protocol = config.protocol || req.protocol;
            var host = req.get('host');
            settings['CommitStream.AppUrl'] = protocol + '://' + host + '/app?key=' + req.query.key;

            var instance = req.query.instance;
            if (!instance) {
               res.end(JSON.stringify(settings));
            }
            try {
                var settings = db.getData('/' + instance);
                res.end(JSON.stringify(settings));
            } catch (ex) {
                res.end(JSON.stringify(settings));
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
                settings = getDefaultSettings();
            }
            for(var prop in req.body) {
                settings[prop] = req.body[prop];
            }
            if (exists) {
                db.save();
            } else {
                db.push('/' + instance, settings);
            }
            res.end('saved');
        });
    };
})(module.exports);