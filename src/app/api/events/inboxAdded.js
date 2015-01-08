(function(inboxAdded) {
	var uuid = require('uuid-v4');

	inboxAdded.create = function(digestId, family, name, url) {
		var eventId = uuid();
		var inboxId = uuid();
		return {
			eventType: 'InboxAdded',
			eventId: eventId,
			data: {
				digestId: digestId,
				inboxId: inboxId,
				family: family,
				name: name,
				url: url
			}
		};
	};
})(module.exports);