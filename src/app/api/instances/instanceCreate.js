'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

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

(function () {
    module.exports = function (req, res) {
        var instanceAddedEvent = _instanceAdded2['default'].create();
        var args = {
            name: 'instances',
            events: instanceAddedEvent
        };

        _helpersEventStoreClient2['default'].postToStream(args).then(function () {
            var hypermedia = (0, _instanceFormatAsHal2['default'])(req.href, instanceAddedEvent.data);
            (0, _helpersSetTimeout2['default'])(function () {
                res.hal(hypermedia, 201);
            }, _config2['default'].controllerResponseDelay);
        });
    };
})();
