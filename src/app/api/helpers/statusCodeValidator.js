'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _middlewareCsError = require('../../middleware/csError');

var _middlewareCsError2 = _interopRequireDefault(_middlewareCsError);

var ProjectionNotFound = (function (_CSError) {
  _inherits(ProjectionNotFound, _CSError);

  function ProjectionNotFound() {
    var message = arguments.length <= 0 || arguments[0] === undefined ? 'Projection not found' : arguments[0];

    _classCallCheck(this, ProjectionNotFound);

    var errors = [message];
    _get(Object.getPrototypeOf(ProjectionNotFound.prototype), 'constructor', this).call(this, errors, 404);
  }

  return ProjectionNotFound;
})(_middlewareCsError2['default']);

;

var StreamNotFound = (function (_CSError2) {
  _inherits(StreamNotFound, _CSError2);

  function StreamNotFound() {
    var message = arguments.length <= 0 || arguments[0] === undefined ? 'Stream not found' : arguments[0];

    _classCallCheck(this, StreamNotFound);

    var errors = [message];
    _get(Object.getPrototypeOf(StreamNotFound.prototype), 'constructor', this).call(this, errors, 404);
  }

  return StreamNotFound;
})(_middlewareCsError2['default']);

;
// TODO: should we handle 408 using this specific failure in each case

var EventStoreClusterFailure = (function (_CSError3) {
  _inherits(EventStoreClusterFailure, _CSError3);

  function EventStoreClusterFailure() {
    _classCallCheck(this, EventStoreClusterFailure);

    var internalMessage = 'Trouble communicating with eventstore.';
    _get(Object.getPrototypeOf(EventStoreClusterFailure.prototype), 'constructor', this).call(this, null, 500, internalMessage);
  }

  return EventStoreClusterFailure;
})(_middlewareCsError2['default']);

;

var QueryError = (function (_CSError4) {
  _inherits(QueryError, _CSError4);

  function QueryError() {
    var message = arguments.length <= 0 || arguments[0] === undefined ? 'Query Error' : arguments[0];

    _classCallCheck(this, QueryError);

    var errors = [message];
    _get(Object.getPrototypeOf(QueryError.prototype), 'constructor', this).call(this, errors, 500);
  }

  return QueryError;
})(_middlewareCsError2['default']);

;
_middlewareCsError2['default'].ProjectionNotFound = ProjectionNotFound;
_middlewareCsError2['default'].StreamNotFound = StreamNotFound;
_middlewareCsError2['default'].QueryError = QueryError;

var statusCodeValidator = {};

exports['default'] = _Object$assign(statusCodeValidator, {
  validateGetProjection: function validateGetProjection(objectType, objectId) {
    return function (response) {
      if (!response.body || response.body.length < 1 || response.statusCode === 404) {
        throw new ProjectionNotFound('Could not find ' + objectType + ' with id ' + objectId + '.');
      }
      if (response.statusCode !== 200) {
        throw new Error(response.statusCode);
      }
      // TODO handle ***UNKNOWN** with 200 status code
      var data = JSON.parse(response.body);
      return data;
    };
  },
  validateGetStream: function validateGetStream(streamName) {
    return function (response) {
      if (!response.body || response.body.length < 1 || response.statusCode === 404) {
        throw new StreamNotFound('Could not find stream with name ' + streamName + '.');
      }
      if (response.statusCode !== 200) {
        throw new Error(response.statusCode);
      }
      var data = JSON.parse(response.body);
      return data;
    };
  },
  validateStreamsPost: function validateStreamsPost(response) {
    if (response.statusCode === 408) {
      throw new EventStoreClusterFailure();
    }
    if (response.statusCode !== 201) {
      throw new Error(response.statusCode);
    }
    return true;
  },
  validateQueryGetState: function validateQueryGetState(response) {
    if (response.statusCode !== 200) {
      throw new QueryError('An error happend when try to query');
    }
    return !response.body || response.body.length < 1 ? {
      'events': []
    } : JSON.parse(response.body);
  },
  validateQueryCreate: function validateQueryCreate(response) {
    if (response.statusCode !== 201) {
      throw new QueryError('An error happend when try to create query');
    }
    return !response.body || response.body.length < 1 ? {} : JSON.parse(response.body);
  },
  validateQueryGetStatus: function validateQueryGetStatus(response) {
    if (response.statusCode !== 200) {
      throw new QueryError('An error happend when try to get the query\'s status');
    }
    if (!response.body || response.body.length < 1) {
      throw new QueryError('An error happend when try to get the query\'s status');
    } else {
      var body = JSON.parse(response.body);
      if (body.status === 'Faulted') {
        throw new QueryError('An error happend when try to get the query\'s status: Faulted');
      } else {
        return body;
      }
    }
  }
});
module.exports = exports['default'];
