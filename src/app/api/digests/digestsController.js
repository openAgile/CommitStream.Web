'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _digestCreate = require('./digestCreate');

var _digestCreate2 = _interopRequireDefault(_digestCreate);

var _digestGet = require('./digestGet');

var _digestGet2 = _interopRequireDefault(_digestGet);

var _digestCommitsGet = require('./digestCommitsGet');

var _digestCommitsGet2 = _interopRequireDefault(_digestCommitsGet);

var _digestInboxesGet = require('./digestInboxesGet');

var _digestInboxesGet2 = _interopRequireDefault(_digestInboxesGet);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

exports['default'] = {
  init: function init(app) {
    app.post('/api/:instanceId/digests', _bodyParser2['default'].json(), _digestCreate2['default']);
    app.get('/api/:instanceId/digests/:digestId', _digestGet2['default']);
    app.get('/api/:instanceId/digests', _digestGet2['default']);
    app.get('/api/:instanceId/digests/:digestId/commits', _digestCommitsGet2['default']);
    app.get('/api/:instanceId/digests/:digestId/inboxes', _digestInboxesGet2['default']);
  }
};
module.exports = exports['default'];
