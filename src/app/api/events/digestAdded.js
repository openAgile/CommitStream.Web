(function(digestAdded) {
  var uuid = require('uuid-v4'),
    schemaValidator = require('../schemaValidator');

  digestAdded.create = function(instanceId, description) {
    var eventId = uuid();
    var digestId = uuid();

    return {
      eventType: 'DigestAdded',
      eventId: eventId,
      data: {
        instanceId: instanceId,
        digestId: digestId,
        description: description
      }
    };
  };

  digestAdded.SCHEMA = {
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

  digestAdded.validate = function(data) {
    return schemaValidator.validate('digest', data, digestAdded.SCHEMA);
  };

})(module.exports);