'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _instanceCreate = require('./instanceCreate');

var _instanceCreate2 = _interopRequireDefault(_instanceCreate);

var _instanceCommitsGet = require('./instanceCommitsGet');

var _instanceCommitsGet2 = _interopRequireDefault(_instanceCommitsGet);

var _instanceCommitsGet3 = _interopRequireDefault(_instanceCommitsGet);

(function (instancesController) {
   instancesController.init = function (app) {
      app.post('/api/instances', _instanceCreate2['default']);
      app.get('/api/instances/:instanceId', _instanceCommitsGet2['default']);
      app.get('/api/:instanceId/commits/tags/versionone/workitem', _instanceCommitsGet3['default']);
   };
})(module.exports);
