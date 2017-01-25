'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _eventstoreClient = require('eventstore-client');

var _eventstoreClient2 = _interopRequireDefault(_eventstoreClient);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var client = new _eventstoreClient2['default']({
  baseUrl: _config2['default'].eventStoreBaseUrl,
  username: _config2['default'].eventStoreUser,
  password: _config2['default'].eventStorePassword
});

_bluebird2['default'].promisifyAll(client.streams);
_bluebird2['default'].promisifyAll(client.projections);
_bluebird2['default'].promisifyAll(client.projection);

exports['default'] = client;
module.exports = exports['default'];
