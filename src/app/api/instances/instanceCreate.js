'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _this = this;

var _instanceFormatAsHal = require('./instanceFormatAsHal');

var _instanceFormatAsHal2 = _interopRequireDefault(_instanceFormatAsHal);

var _instanceAdded = require('./instanceAdded');

var _instanceAdded2 = _interopRequireDefault(_instanceAdded);

var _helpersEventStoreClient = require('../helpers/eventStoreClient');

var _helpersEventStoreClient2 = _interopRequireDefault(_helpersEventStoreClient);

var _helpersSetTimeout = require('../helpers/setTimeout');

var _helpersSetTimeout2 = _interopRequireDefault(_helpersSetTimeout);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

exports['default'] = function callee$0$0(req, res) {
    var instanceAddedEvent, args, hypermedia;
    return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                instanceAddedEvent = _instanceAdded2['default'].create();
                args = {
                    name: 'instances',
                    events: instanceAddedEvent
                };
                context$1$0.next = 4;
                return _regeneratorRuntime.awrap(_helpersEventStoreClient2['default'].postToStream(args));

            case 4:
                hypermedia = (0, _instanceFormatAsHal2['default'])(req.href, instanceAddedEvent.data);

                (0, _helpersSetTimeout2['default'])(function () {
                    res.hal(hypermedia, 201);
                }, _config2['default'].controllerResponseDelay);

            case 6:
            case 'end':
                return context$1$0.stop();
        }
    }, null, _this);
};

module.exports = exports['default'];
