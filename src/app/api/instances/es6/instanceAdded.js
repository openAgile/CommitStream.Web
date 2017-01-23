(((instanceAdded) => {
    const uuid = require('uuid-v4')
    const schemaValidator = require('../schemaValidator');

    instanceAdded.create = function() {
        const eventId = uuid();
        const instanceId = uuid();
        const apiKey = uuid();
        const instanceAddedEvent = {
            eventType: 'InstanceAdded',
            eventId: eventId,
            data: {
                instanceId: instanceId,
                apiKey: apiKey,
            }
        };

        return instanceAddedEvent;
    };

    instanceAdded.SCHEMA = {
        "title": "instance",
        "type": "object",
        "required": [
            "instanceId"
        ],
        "properties": {
            "instanceId": {
                "title": "ID of the instance",
                "type": "string",
                "minLength": 36,
                "maxLength": 36
            },
            "apiKey": {
                "title": "API Key for this instance",
                "type": "string",
                "minLength": 36,
                "maxLength": 36
            }
        }
    };

    instanceAdded.validate = function(data) {
        return schemaValidator.validate('instance', data, instanceAdded.SCHEMA);
    };

}))(module.exports);