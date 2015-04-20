(function() {
  var EventStore = require('eventstore-client'),
    config = require('../../config'),
    _ = require('underscore'),
    statusCodeValidator = require('./statusCodeValidator');

  var client = new EventStore({
    baseUrl: config.eventStoreBaseUrl,
    username: config.eventStoreUser,
    password: config.eventStorePassword
  });

  client.queryStatePartitionById = function(args) {
    var stateArgs = {
      name: args.name,
      partition: args.name + '-' + args.id
    };

    return client.projection.getStateAsync(stateArgs)
      .then(statusCodeValidator.validateGetProjection(args.name, args.id));
  };

  client.postToStream = function(args) {
    // Stay immutable, bro
    var events = args.events;
    if (!_.isArray(events)) {
      events = [events];
    };
    events = JSON.stringify(events);

    var postArgs = {
      name: args.name,
      events: events
    };

    return client.streams.postAsync(postArgs)
      .then(statusCodeValidator.validateStreamsPost);
  };

  client.getFromStream = function(args) {
    var getArgs = {
      name: args.name
    };

    return client.streams.getAsync(getArgs)
      .then(statusCodeValidator.validateGetStream(args.name));
  };

  module.exports = client;
})();