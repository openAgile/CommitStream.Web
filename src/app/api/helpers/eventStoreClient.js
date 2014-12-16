(function() {
	var eventStore = require('./eventStore');
	var config = require('../../config');
	module.exports = new eventStore(config.eventStoreBaseUrl, config.eventStoreUser, config.eventStorePassword);
})();