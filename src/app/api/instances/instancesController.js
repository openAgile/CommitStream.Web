'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _instanceCreate = require('./instanceCreate');

var _instanceCreate2 = _interopRequireDefault(_instanceCreate);

var _instanceGet = require('./instanceGet');

var _instanceGet2 = _interopRequireDefault(_instanceGet);

var _instanceCommitsGet = require('./instanceCommitsGet');

var _instanceCommitsGet2 = _interopRequireDefault(_instanceCommitsGet);

exports['default'] = {
	init: function init(app) {
		app.post('/api/instances', _instanceCreate2['default']);
		app.get('/api/instances/:instanceId', _instanceGet2['default']);
		app.get('/api/:instanceId/commits/tags/versionone/workitem', _instanceCommitsGet2['default']);
	}
};
module.exports = exports['default'];
