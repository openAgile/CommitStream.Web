'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _azBunyan = require('az-bunyan');

var _azBunyan2 = _interopRequireDefault(_azBunyan);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var level = 'info';
var name = 'CSError-Logger';

var streamsConfigured = [{
  level: level,
  stream: process.stderr
}];
if (_config2['default'].azureLoggerConfigured) {
  var tableName = _config2['default'].azureTableName;
  var connectionString = _config2['default'].storageConnectionString;
  streamsConfigured.push(_azBunyan2['default'].createTableStorageStream(level, {
    connectionString: connectionString,
    tableName: tableName
  }));
}

var logger = _bunyan2['default'].createLogger({
  name: name,
  serializers: {
    req: _bunyan2['default'].stdSerializers.req,
    err: _bunyan2['default'].stdSerializers.err
  },
  streams: streamsConfigured
});

exports['default'] = logger;
module.exports = exports['default'];
