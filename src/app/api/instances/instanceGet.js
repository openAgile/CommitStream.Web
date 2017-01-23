'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _instanceFormatAsHal = require('./instanceFormatAsHal');

var _instanceFormatAsHal2 = _interopRequireDefault(_instanceFormatAsHal);

exports['default'] = function (req, res) {
	res.hal((0, _instanceFormatAsHal2['default'])(req.href, req.instance));
};

module.exports = exports['default'];
