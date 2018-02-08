'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _this = this;

var _apiHelpersVcsFamilies = require('../api/helpers/vcsFamilies');

var _apiHelpersVcsFamilies2 = _interopRequireDefault(_apiHelpersVcsFamilies);

var _apiHelpersEventStoreClient = require('../api/helpers/eventStoreClient');

var _apiHelpersEventStoreClient2 = _interopRequireDefault(_apiHelpersEventStoreClient);

var _glanceJson = require('glance-json');

var _glanceJson2 = _interopRequireDefault(_glanceJson);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var currentTotals = _Promise.all(_Object$keys(_apiHelpersVcsFamilies2['default']).map(function callee$0$0(family) {
    var args;
    return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                args = {
                    name: '$et-' + family + 'CommitReceived',
                    count: 1,
                    embed: 'tryharder'
                };
                context$1$0.t0 = family;
                context$1$0.next = 4;
                return _regeneratorRuntime.awrap(_apiHelpersEventStoreClient2['default'].getFromStream(args));

            case 4:
                context$1$0.t1 = context$1$0.sent;
                context$1$0.t2 = (0, _glanceJson2['default'])(context$1$0.t1, 'positionEventNumber');
                return context$1$0.abrupt('return', {
                    family: context$1$0.t0,
                    count: context$1$0.t2
                });

            case 7:
            case 'end':
                return context$1$0.stop();
        }
    }, null, _this);
}));

currentTotals.then(function (results) {
    var count = results.reduce(function (sum, o) {
        return sum + o.count;
    }, 0);
    results.forEach(function (o, i) {
        return o.percentage = (o.count / count * 100).toFixed(2);
    });
    results.push({ family: 'Total', count: count });
    console.log(_underscore2['default'].sortBy(results, function (o) {
        return -o.count;
    }));
});
