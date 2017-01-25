'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _eventstoreClient = require('eventstore-client');

var _eventstoreClient2 = _interopRequireDefault(_eventstoreClient);

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _statusCodeValidator = require('./statusCodeValidator');

var _statusCodeValidator2 = _interopRequireDefault(_statusCodeValidator);

var client = new _eventstoreClient2['default']({
  baseUrl: _config2['default'].eventStoreBaseUrl,
  username: _config2['default'].eventStoreUser,
  password: _config2['default'].eventStorePassword
});

client.queryStatePartitionById = function (args) {
  var partition = args.partition || args.name + '-' + args.id;
  var stateArgs = {
    name: args.name,
    partition: partition
  };

  return client.projection.getStateAsync(stateArgs).then(_statusCodeValidator2['default'].validateGetProjection(args.name, args.id));
};

client.postToStream = function (args) {
  // Stay immutable, bro
  var events = args.events;
  if (!_underscore2['default'].isArray(events)) {
    events = [events];
  }
  events = JSON.stringify(events);

  var postArgs = {
    name: args.name,
    events: events
  };

  return client.streams.postAsync(postArgs).then(_statusCodeValidator2['default'].validateStreamsPost);
};

client.getFromStream = function (args) {
  var getArgs = _underscore2['default'].pick(args, 'name', 'count', 'pageUrl', 'embed');

  return client.streams.getAsync(getArgs).then(_statusCodeValidator2['default'].validateGetStream(args.name));
};

client.queryCreate = function (args) {
  return client.query.postAsync(args).then(_statusCodeValidator2['default'].validateQueryCreate);
};

client.queryGetState = function (args) {
  return client.query.getStateAsync(args).then(_statusCodeValidator2['default'].validateQueryGetState);
};

client.queryGetStatus = function (args) {
  return client.query.getStatusAsync(args).then(_statusCodeValidator2['default'].validateQueryGetStatus);
};

exports['default'] = client;
module.exports = exports['default'];
