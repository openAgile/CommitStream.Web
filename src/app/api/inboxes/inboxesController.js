'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
   value: true
});

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _inboxCreate = require('./inboxCreate');

var _inboxCreate2 = _interopRequireDefault(_inboxCreate);

var _commitsCreate = require('./commitsCreate');

var _commitsCreate2 = _interopRequireDefault(_commitsCreate);

var _inboxGet = require('./inboxGet');

var _inboxGet2 = _interopRequireDefault(_inboxGet);

var _inboxScriptConfiguration = require('./inboxScriptConfiguration');

var _inboxScriptConfiguration2 = _interopRequireDefault(_inboxScriptConfiguration);

var _inboxRemove = require('./inboxRemove');

var _inboxRemove2 = _interopRequireDefault(_inboxRemove);

var _middlewareCatchAsyncErrors = require('../../middleware/catchAsyncErrors');

var _middlewareCatchAsyncErrors2 = _interopRequireDefault(_middlewareCatchAsyncErrors);

exports['default'] = {
   init: function init(app) {
      app.post('/api/:instanceId/digests/:digestId/inboxes', _bodyParser2['default'].json(), _inboxCreate2['default']);
      app.post('/api/:instanceId/inboxes/:inboxId/commits', _bodyParser2['default'].json({ limit: '50mb' }), (0, _middlewareCatchAsyncErrors2['default'])(_commitsCreate2['default']));
      app.get('/api/:instanceId/inboxes/:inboxId', _inboxGet2['default']);
      app.get('/api/:instanceId/inboxes/:inboxId/script', _inboxScriptConfiguration2['default']);
      app['delete']('/api/:instanceId/inboxes/:inboxId', _inboxRemove2['default']);
   }
};
module.exports = exports['default'];
