'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

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
    var partition = args.partition || args.name + '-' + args.id;

    var stateArgs = {
      name: args.name,
      partition: partition
    };

    return client.projection.getStateAsync(stateArgs).then(_statusCodeValidator2['default'].validateGetProjection(args.name, args.id));
  },
  postToStream: function postToStream(args) {
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
  },
  getFromStream: function getFromStream(args) {
    var getArgs = _underscore2['default'].pick(args, 'name', 'count', 'pageUrl', 'embed');

    return client.streams.getAsync(getArgs).then(_statusCodeValidator2['default'].validateGetStream(args.name));
  },
  queryCreate: function queryCreate(args) {
    return client.query.postAsync(args).then(_statusCodeValidator2['default'].validateQueryCreate);
  },
  queryGetState: function queryGetState(args) {
    return client.query.getStateAsync(args).then(_statusCodeValidator2['default'].validateQueryGetState);
  },
  queryGetStatus: function queryGetStatus(args) {
    return client.query.getStatusAsync(args).then(_statusCodeValidator2['default'].validateQueryGetStatus);
  }
});
module.exports = exports['default'];
