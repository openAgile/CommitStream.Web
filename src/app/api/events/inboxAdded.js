(function(inboxAdded) {
	var uuid = require('uuid-v4'),
		schemaValidator = require('../schemaValidator');

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

	inboxAdded.SCHEMA = {
		"title": "inbox",
		"type": "object",
		"required": [
			"digestId",
			"family",
			"name"
		],
		"properties": {
			"digestId": {
				"title": "ID of the digest to which this inbox will belong",
				"type": "string",
				"minLength": 36,
				"maxLength": 36
			},
			"family": {
				"title": "Version Control System type",
				"type": "string",
				"enum": [
					"GitHub"
				]
			},
			"name": {
				"type": "string",
				"title": "Short name for this inbox",
				"minLength": 3,
				"maxLength": 140
			},
			"url": {
				"type": "string",
				"title": "URL of the repository",
				"maxLength": 2000,
				"minLength": 10
			}
		}
	};

	inboxAdded.validate = function(data) {		
      return schemaValidator.validate('inbox', data, inboxAdded.SCHEMA);
	};

})(module.exports);