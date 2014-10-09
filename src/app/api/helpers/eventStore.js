var config = require("../../config");
var request = require('request');

(function (eventStore) {
    eventStore.pushEvents = function (events) {
        
        var eventStoreUrl = config.eventStoreProtocol + 
            '://' + config.eventStoreHost + 
            ':' + config.eventStorePort + 
            '/streams/github-events';
        
        var options = {
            url: eventStoreUrl,
            body: events,
            headers: {
                'Accept': 'application/json',
                'Content-Type': "application/vnd.eventstore.events+json",
                'Content-Length': events.length,
                'Authorization': 'Basic YWRtaW46Y2hhbmdlaXQ=' // TODO: read this from the config
            }
        };
        
        request.post(options, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                console.log('Posted to eventstore.');
                console.log(response.statusCode);
            }
        });
        
    };
    eventStore.getLastCommit = function (owner, repo, next) {
        var eventStoreUrl = config.eventStoreProtocol + 
            '://' + config.eventStoreHost + 
            ':' + config.eventStorePort + 
            '/streams/repo-' + owner + '-' + repo + '/head?embed=content';
        var options = {
            url: eventStoreUrl,            
            headers: {
                'Accept': 'application/json'
            }
        };
        request.get(options, function (error, response, body) {
            console.log('Getting the last commit for this repository');
            if (response.statusCode == 404) {
                next('Stream not found, You need to do a full import', null);
            }
            if (response.statusCode == 200) {
                next(null, body);
            }
        });
    };

})(module.exports);