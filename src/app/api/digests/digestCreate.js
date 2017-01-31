'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _this = this;

var _digestAdded = require('./digestAdded');

var _digestAdded2 = _interopRequireDefault(_digestAdded);

var _digestFormatAsHal = require('./digestFormatAsHal');

var _digestFormatAsHal2 = _interopRequireDefault(_digestFormatAsHal);

var _helpersEventStoreClient = require('../helpers/eventStoreClient');

var _helpersEventStoreClient2 = _interopRequireDefault(_helpersEventStoreClient);

var _sanitizeAndValidate = require('../sanitizeAndValidate');

var _sanitizeAndValidate2 = _interopRequireDefault(_sanitizeAndValidate);

var _helpersSetTimeout = require('../helpers/setTimeout');

var _helpersSetTimeout2 = _interopRequireDefault(_helpersSetTimeout);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

exports['default'] = function callee$0$0(req, res) {
  var instanceId, digestAddedEvent, args, hypermedia;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        (0, _sanitizeAndValidate2['default'])('digest', req.body, ['description'], _digestAdded2['default']);
        instanceId = req.instance.instanceId;
        digestAddedEvent = _digestAdded2['default'].create(instanceId, req.body.description);
        args = {
          name: 'digests-' + instanceId,
          events: digestAddedEvent
        };
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(_helpersEventStoreClient2['default'].postToStream(args));

      case 6:
        hypermedia = (0, _digestFormatAsHal2['default'])(req.href, instanceId, digestAddedEvent.data);

        (0, _helpersSetTimeout2['default'])(function () {
          res.hal(hypermedia, 201);
        }, _config2['default'].controllerResponseDelay);

      case 8:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this);
};

module.exports = exports['default'];
