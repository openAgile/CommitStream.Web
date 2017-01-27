'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _this = this;

var _inboxRemoved = require('./inboxRemoved');

var _inboxRemoved2 = _interopRequireDefault(_inboxRemoved);

var _helpersEventStoreClient = require('../helpers/eventStoreClient');

var _helpersEventStoreClient2 = _interopRequireDefault(_helpersEventStoreClient);

exports['default'] = function callee$0$0(req, res) {
    var instanceId, digestId, inboxId, inboxRemovedEvent, args, responseBody;
    return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                instanceId = req.instance.instanceId;
                digestId = req.inbox.digestId;
                inboxId = req.params.inboxId;
                inboxRemovedEvent = _inboxRemoved2['default'].create(instanceId, digestId, inboxId);
                args = {
                    name: 'inboxes-' + instanceId,
                    events: inboxRemovedEvent
                };
                context$1$0.next = 7;
                return _regeneratorRuntime.awrap(_helpersEventStoreClient2['default'].postToStream(args));

            case 7:
                responseBody = {
                    message: 'The inbox ' + inboxId + ' has been removed from instance ' + instanceId + '.'
                };

                res.status(200).json(responseBody);

            case 9:
            case 'end':
                return context$1$0.stop();
        }
    }, null, _this);
};

module.exports = exports['default'];
