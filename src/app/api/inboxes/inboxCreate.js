'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _this = this;

var _inboxAdded = require('./inboxAdded');

var _inboxAdded2 = _interopRequireDefault(_inboxAdded);

var _helpersEventStoreClient = require('../helpers/eventStoreClient');

var _helpersEventStoreClient2 = _interopRequireDefault(_helpersEventStoreClient);

var _inboxFormatAsHal = require('./inboxFormatAsHal');

var _inboxFormatAsHal2 = _interopRequireDefault(_inboxFormatAsHal);

var _sanitizeAndValidate = require('../sanitizeAndValidate');

var _sanitizeAndValidate2 = _interopRequireDefault(_sanitizeAndValidate);

var _helpersSetTimeout = require('../helpers/setTimeout');

var _helpersSetTimeout2 = _interopRequireDefault(_helpersSetTimeout);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

exports['default'] = function callee$0$0(req, res) {
    var digestId, instanceId, inboxAddedEvent, args, hypermedia;
    return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                digestId = req.params.digestId;
                instanceId = req.instance.instanceId;

                req.body.digestId = digestId;

                (0, _sanitizeAndValidate2['default'])('inbox', req.body, ['family', 'name', 'url'], _inboxAdded2['default']);

                inboxAddedEvent = _inboxAdded2['default'].create(instanceId, digestId, req.body.family, req.body.name, req.body.url);
                args = {
                    name: 'inboxes-' + instanceId,
                    events: inboxAddedEvent
                };
                context$1$0.next = 8;
                return _regeneratorRuntime.awrap(_helpersEventStoreClient2['default'].postToStream(args));

            case 8:
                hypermedia = (0, _inboxFormatAsHal2['default'])(req.href, instanceId, inboxAddedEvent.data);

                (0, _helpersSetTimeout2['default'])(function () {
                    res.hal(hypermedia, 201);
                }, _config2['default'].controllerResponseDelay);

            case 10:
            case 'end':
                return context$1$0.stop();
        }
    }, null, _this);
};

module.exports = exports['default'];
