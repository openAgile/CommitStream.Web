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

var _digestsFormatAsHal = require('./digestsFormatAsHal');

var _digestsFormatAsHal2 = _interopRequireDefault(_digestsFormatAsHal);

exports['default'] = function callee$0$0(req, res) {
  var instanceId, args, digests;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        instanceId = req.instance.instanceId;
        args = {
          name: 'digests-' + instanceId
        };
        context$1$0.prev = 2;
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(_helpersEventStoreClient2['default'].getFromStream(args));

      case 5:
        digests = context$1$0.sent;

        res.hal((0, _digestsFormatAsHal2['default'])(req.href, instanceId, digests.entries));
        context$1$0.next = 12;
        break;

      case 9:
        context$1$0.prev = 9;
        context$1$0.t0 = context$1$0['catch'](2);

        if (context$1$0.t0 instanceof _middlewareCsError2['default'].StreamNotFound) {
          res.hal((0, _digestsFormatAsHal2['default'])(req.href, instanceId));
        }

      case 12:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[2, 9]]);
};

module.exports = exports['default'];
