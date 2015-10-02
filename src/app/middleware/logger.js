'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _azBunyan = require('az-bunyan');

var _azBunyan2 = _interopRequireDefault(_azBunyan);

// TODO: pull from app settings:
// define the target azure storage table name
var tableName = 'developingapplogtable';
// define the connection string to your azure storage account
var connectionString = 'DefaultEndpointsProtocol=https;AccountName=commitstreamdev;AccountKey=PBr7JHysuTvIXJwljstuPLmBoVCao/UQvPVqiJQRrfXgAdXAw41hQpXKz1f+fSzQ3niJVMwgTU7fsSA+1esmIA==';
var level = 'info';
var name = 'CSError-Logger';

// initialize the az-bunyan table storage stream
var azureStream = _azBunyan2['default'].createTableStorageStream(level, {
  connectionString: connectionString,
  tableName: tableName
});

var logger = _bunyan2['default'].createLogger({
  name: name,
  serializers: {
    req: _bunyan2['default'].stdSerializers.req,
    err: _bunyan2['default'].stdSerializers.err
  },
  streams: [{
    level: level,
    stream: process.stderr
  }, azureStream]
});

exports['default'] = logger;
module.exports = exports['default'];
