'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _uuidV4 = require('uuid-v4');

var _uuidV42 = _interopRequireDefault(_uuidV4);

exports['default'] = {
    create: function create(instanceId, digestId, inboxId) {
        var eventId = (0, _uuidV42['default'])();
        return {
            eventType: 'InboxRemoved',
            eventId: eventId,
            data: {
                instanceId: instanceId,
                digestId: digestId,
                inboxId: inboxId
            }
        };
    }
};
module.exports = exports['default'];
