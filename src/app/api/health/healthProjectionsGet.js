'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _this = this;

var _helpersEventStoreClient = require('../helpers/eventStoreClient');

var _helpersEventStoreClient2 = _interopRequireDefault(_helpersEventStoreClient);

var RUNNING_STATUS = 'Running';

exports['default'] = function callee$0$0(req, res) {
  var response, eventStoreResponse, nonRunningProjections, projectionStatus;
  return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(_helpersEventStoreClient2['default'].projections.getAsync());

      case 2:
        response = context$1$0.sent;
        eventStoreResponse = JSON.parse(response.body);
        nonRunningProjections = eventStoreResponse.projections.filter(function (projection) {
          return projection.status !== RUNNING_STATUS;
        });
        projectionStatus = { status: 'healthy' };

        if (nonRunningProjections.length > 0) {
          projectionStatus.status = 'errors';
          projectionStatus.projections = nonRunningProjections;
        }

        res.json(projectionStatus);

      case 8:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this);
};

module.exports = exports['default'];
