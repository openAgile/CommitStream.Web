'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
        value: true
});

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

exports['default'] = inboxesController(function () {
        var init = function init(app) {
                app.post('/api/:instanceId/digests/:digestId/inboxes', _bodyParser2['default'].json(), require('./inboxCreate'));

                app.post('/api/:instanceId/inboxes/:inboxId/commits', _bodyParser2['default'].json({ limit: '50mb' }), require('./commitsCreate'));

                app.get('/api/:instanceId/inboxes/:inboxId', require('./inboxGet'));

                app.get('/api/:instanceId/inboxes/:inboxId/script', require('./inboxScriptConfiguration'));

                app['delete']('/api/:instanceId/inboxes/:inboxId', require('./inboxRemove'));
        };
});
module.exports = exports['default'];
