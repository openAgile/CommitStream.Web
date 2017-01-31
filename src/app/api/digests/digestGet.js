'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _digestFormatAsHal = require('./digestFormatAsHal');

var _digestFormatAsHal2 = _interopRequireDefault(_digestFormatAsHal);

var _validateUUID = require('../validateUUID');

var _validateUUID2 = _interopRequireDefault(_validateUUID);

exports['default'] = function (req, res) {
    (0, _validateUUID2['default'])('digests', req.params.digestId);

    var hypermedia = (0, _digestFormatAsHal2['default'])(req.href, req.params.instanceId, req.digest);
    res.hal(hypermedia);
};

module.exports = exports['default'];
