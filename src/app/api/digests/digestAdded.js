'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _uuidV4 = require('uuid-v4');

var _uuidV42 = _interopRequireDefault(_uuidV4);

var _schemaValidator = require('../schemaValidator');

var _schemaValidator2 = _interopRequireDefault(_schemaValidator);

var SCHEMA = {
  "title": "digest",
  "type": "object",
  "required": ["description"],
  "properties": {
    "description": {
      "title": "",
      "type": "string",
      "minLength": 1,
      "maxLength": 140
    }
  }
};

exports['default'] = {
  create: function create(instanceId, description) {
    var eventId = (0, _uuidV42['default'])();
    var digestId = (0, _uuidV42['default'])();
    var DigestAddedEvent = {
      eventType: 'DigestAdded',
      eventId: eventId,
      data: {
        instanceId: instanceId,
        digestId: digestId,
        description: description
      }
    };
    return DigestAddedEvent;
  },

  validate: function validate(data) {
    return _schemaValidator2['default'].validate('digest', data, SCHEMA);
  }
};
module.exports = exports['default'];
