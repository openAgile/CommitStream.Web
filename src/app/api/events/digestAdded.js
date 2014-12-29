(function(digestAdded) {
	var uuid = require('uuid-v4');

	digestAdded.create = function(description) {
		var eventId = uuid();
		var digestId = uuid();

		return {
			eventType: 'DigestAdded',
			eventId: eventId,
			data: {
				digestId: digestId,
				description: description
			}
		};
	};
})(module.exports);