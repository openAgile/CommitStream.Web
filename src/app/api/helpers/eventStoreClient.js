'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

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

exports['default'] = _Object$assign(client, {
  queryStatePartitionById: function queryStatePartitionById(args) {
    var partition, stateArgs, response;
    return _regeneratorRuntime.async(function queryStatePartitionById$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          partition = args.partition || args.name + '-' + args.id;
          stateArgs = {
            name: args.name,
            partition: partition
          };
          context$1$0.next = 4;
          return _regeneratorRuntime.awrap(client.projection.getStateAsync(stateArgs));

        case 4:
          response = context$1$0.sent;
          return context$1$0.abrupt('return', _statusCodeValidator2['default'].validateGetProjection(args.name, partition)(response));

        case 6:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  },
  postToStream: function postToStream(args) {
    var events, postArgs, response;
    return _regeneratorRuntime.async(function postToStream$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          events = args.events;

          if (!_underscore2['default'].isArray(events)) {
            events = [events];
          }
          events = JSON.stringify(events);

          postArgs = {
            name: args.name,
            events: events
          };
          context$1$0.next = 6;
          return _regeneratorRuntime.awrap(client.streams.postAsync(postArgs));

        case 6:
          response = context$1$0.sent;
          return context$1$0.abrupt('return', _statusCodeValidator2['default'].validateStreamsPost(response));

        case 8:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  },
  getFromStream: function getFromStream(args) {
    var getArgs, response;
    return _regeneratorRuntime.async(function getFromStream$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          getArgs = _underscore2['default'].pick(args, 'name', 'count', 'pageUrl', 'embed');
          context$1$0.next = 3;
          return _regeneratorRuntime.awrap(client.streams.getAsync(getArgs));

        case 3:
          response = context$1$0.sent;
          return context$1$0.abrupt('return', _statusCodeValidator2['default'].validateGetStream(args.name)(response));

        case 5:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  },
  queryCreate: function queryCreate(args) {
    var response;
    return _regeneratorRuntime.async(function queryCreate$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          context$1$0.next = 2;
          return _regeneratorRuntime.awrap(client.query.postAsync(args));

        case 2:
          response = context$1$0.sent;
          return context$1$0.abrupt('return', _statusCodeValidator2['default'].validateQueryCreate(response));

        case 4:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  },
  queryGetState: function queryGetState(args) {
    var response;
    return _regeneratorRuntime.async(function queryGetState$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          context$1$0.next = 2;
          return _regeneratorRuntime.awrap(client.query.getStateAsync(args));

        case 2:
          response = context$1$0.sent;
          return context$1$0.abrupt('return', _statusCodeValidator2['default'].validateQueryGetState(response));

        case 4:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  },
  queryGetStatus: function queryGetStatus(args) {
    var response;
    return _regeneratorRuntime.async(function queryGetStatus$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          context$1$0.next = 2;
          return _regeneratorRuntime.awrap(client.query.getStatusAsync(args));

        case 2:
          response = context$1$0.sent;
          return context$1$0.abrupt('return', _statusCodeValidator2['default'].validateQueryGetStatus(response));

        case 4:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  }
});
module.exports = exports['default'];

// Stay immutable, bro
