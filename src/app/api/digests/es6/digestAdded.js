import uuid from 'uuid-v4';
import schemaValidator from '../schemaValidator';

const SCHEMA = {
    "title": "digest",
    "type": "object",
    "required": [
      "description"
    ],
    "properties": {
      "description": {
        "title": "",
        "type": "string",
        "minLength": 1,
        "maxLength": 140
      }
    }
};


export default {
	create(instanceId, description) {
		const eventId = uuid();
    	const digestId = uuid();
    	const DigestAddedEvent = {
			eventType: 'DigestAdded',
      		eventId: eventId,
      		data: {
        			instanceId,
        			digestId,
        			description
      		}
		}
		return DigestAddedEvent;
	},

	validate(data) {
		return schemaValidator.validate('digest', data, SCHEMA);	
	}	
};