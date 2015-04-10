(function() {
  var EventStore = require('eventstore-client'),
    config = require('../../config'),
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

  module.exports = client;
})();