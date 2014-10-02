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
            console.log('Posted to eventstore.');
            console.log(response.statusCode);
        });
        
    };

})(module.exports);