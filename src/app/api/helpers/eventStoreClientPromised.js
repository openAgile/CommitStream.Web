(function() {
  var EventStore = require('eventstore-client'),
      Promise = require('bluebird'),
      config = require('../../config');

  var client = new EventStore({
    baseUrl: config.eventStoreBaseUrl,
    username: config.eventStoreUser,
    password: config.eventStorePassword
  });

  Promise.promisifyAll(client.streams);
  Promise.promisifyAll(client.projections);
  Promise.promisifyAll(client.projection);

  module.exports = client;
}());