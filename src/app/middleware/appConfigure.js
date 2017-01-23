'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _resHref = require('./resHref');

var _resHref2 = _interopRequireDefault(_resHref);

var _resHal = require('./resHal');

var _resHal2 = _interopRequireDefault(_resHal);

exports['default'] = function (app) {
	app.use(_resHref2['default']);
	app.use(_resHal2['default']);
	return app;
};

module.exports = exports['default'];
