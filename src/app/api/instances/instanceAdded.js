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
    "title": "instance",
    "type": "object",
    "required": ["instanceId"],
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

exports['default'] = {
    create: function create() {
        var eventId = (0, _uuidV42['default'])();
        var instanceId = (0, _uuidV42['default'])();
        var apiKey = (0, _uuidV42['default'])();
        var instanceAddedEvent = {
            eventType: 'InstanceAdded',
            eventId: eventId,
            data: {
                instanceId: instanceId,
                apiKey: apiKey
            }
        };

        return instanceAddedEvent;
    },
    validate: function validate(data) {
        return _schemaValidator2['default'].validate('instance', data, SCHEMA);
    }
};
module.exports = exports['default'];
