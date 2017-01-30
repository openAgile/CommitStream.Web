'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _this = this;

var _helpersEventStoreClient = require('../helpers/eventStoreClient');

var _helpersEventStoreClient2 = _interopRequireDefault(_helpersEventStoreClient);

var _middlewareCsError = require('../../middleware/csError');

var _middlewareCsError2 = _interopRequireDefault(_middlewareCsError);

var _digestInboxesFormatAsHal = require('./digestInboxesFormatAsHal');

var _digestInboxesFormatAsHal2 = _interopRequireDefault(_digestInboxesFormatAsHal);

var _validateUUID = require('../validateUUID');

var _validateUUID2 = _interopRequireDefault(_validateUUID);

exports['default'] = function callee$0$0(req, res) {
    var digestId, instanceId, digest, inboxes, hypermedia;
    return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                digestId = req.params.digestId;
                instanceId = req.instance.instanceId;
                digest = req.digest;

                (0, _validateUUID2['default'])('digest', digestId);

                context$1$0.prev = 4;
                context$1$0.next = 7;
                return _regeneratorRuntime.awrap(_helpersEventStoreClient2['default'].queryStatePartitionById({
                    name: 'inboxes-for-digest',
                    partition: 'digestInbox-' + digest.digestId
                }));

            case 7:
                inboxes = context$1$0.sent;
                hypermedia = (0, _digestInboxesFormatAsHal2['default'])(req.href, instanceId, digest, inboxes);

                res.hal(hypermedia);
                context$1$0.next = 15;
                break;

            case 12:
                context$1$0.prev = 12;
                context$1$0.t0 = context$1$0['catch'](4);

                if (context$1$0.t0 instanceof _middlewareCsError2['default'].ProjectionNotFound) {
                    hypermedia = (0, _digestInboxesFormatAsHal2['default'])(req.href, instanceId, digest, { inboxes: {} });

                    res.hal(hypermedia);
                }

            case 15:
            case 'end':
                return context$1$0.stop();
        }
    }, null, _this, [[4, 12]]);
};

module.exports = exports['default'];

// TODO: log the error?
