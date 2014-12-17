(function() {
  var EventStore = require('eventstore-client'),
      config = require('../../config');
  module.exports = new EventStore({
    baseUrl: config.eventStoreBaseUrl,
    username: config.eventStoreUser,
    password: config.eventStorePassword
  });
})();