'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _inboxFormatAsHal = require('./inboxFormatAsHal');

var _inboxFormatAsHal2 = _interopRequireDefault(_inboxFormatAsHal);

var _validateUUID = require('../validateUUID');

var _validateUUID2 = _interopRequireDefault(_validateUUID);

exports['default'] = function (req, res) {
    var inboxId = req.params.inboxId;
    (0, _validateUUID2['default'])('inbox', inboxId);
    res.hal((0, _inboxFormatAsHal2['default'])(req.href, req.instance.instanceId, req.inbox));
};

module.exports = exports['default'];
