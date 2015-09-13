'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];


  var ProjectionNotFound = (function (_CSError) {
    _inherits(ProjectionNotFound, _CSError);

    function ProjectionNotFound() {
      var message = arguments.length <= 0 || arguments[0] === undefined ? 'Projection not found' : arguments[0];

      _classCallCheck(this, ProjectionNotFound);

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _middlewareCsError = require('../../middleware/csError');

var _middlewareCsError2 = _interopRequireDefault(_middlewareCsError);

var ProjectionNotFound = _middlewareCsError2['default'].createCustomError('ProjectionNotFound', function (message) {
  message = message || 'Projection not found';
  var errors = [message];
  ProjectionNotFound.prototype.constructor.call(undefined, errors, 404);
});
_middlewareCsError2['default'].ProjectionNotFound = ProjectionNotFound;

var statusCodeValidator = {};

  ;
  CSError.ProjectionNotFound = ProjectionNotFound;

statusCodeValidator.validateGetProjection = function (objectType, objectId) {
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
};

var StreamNotFound = _middlewareCsError2['default'].createCustomError('StreamNotFound', function (message) {
  message = message || 'Stream not found';

    function StreamNotFound() {
      var message = arguments.length <= 0 || arguments[0] === undefined ? 'Stream not found' : arguments[0];

      _classCallCheck(this, StreamNotFound);

  var errors = [message];
  StreamNotFound.prototype.constructor.call(undefined, errors, 404);
});
_middlewareCsError2['default'].StreamNotFound = StreamNotFound;
    return StreamNotFound;
  })(CSError);

  ;
  CSError.StreamNotFound = StreamNotFound;

statusCodeValidator.validateGetStream = function (streamName) {
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
};

// TODO: should we handle 408 using this specific failure in each case
var EventStoreClusterFailure = _middlewareCsError2['default'].createCustomError('EventStoreClusterFailure', function () {
  EventStoreClusterFailure.prototype.constructor.call(undefined, null, 500, 'Trouble communicating with eventstore.');
});

    function EventStoreClusterFailure() {
      _classCallCheck(this, EventStoreClusterFailure);

      var internalMessage = 'Trouble communicating with eventstore.';
      _get(Object.getPrototypeOf(EventStoreClusterFailure.prototype), 'constructor', this).call(this, null, 500, internalMessage);
    }

    return EventStoreClusterFailure;
  })(CSError);

  ;

statusCodeValidator.validateStreamsPost = function () {
  return function (response) {
    if (response.statusCode === 408) {
      throw new EventStoreClusterFailure();
    }
    if (response.statusCode !== 201) {
      throw new Error(response.statusCode);
    }
    return true;
  };
};
})(module.exports);
var QueryError = _middlewareCsError2['default'].createCustomError('QueryError', function (message) {
  message = message || 'Query Error';
  var errors = [message];
  QueryError.prototype.constructor.call(undefined, errors, 500);
});
_middlewareCsError2['default'].QueryError = QueryError;

statusCodeValidator.validateQueryGetState = function (response) {
  if (response.statusCode !== 200) {
    throw new QueryError('An error happend when try to query');
  }
  return !response.body || response.body.length < 1 ? {
    'events': []
  } : JSON.parse(response.body);
};

statusCodeValidator.validateQueryCreate = function (response) {
  if (response.statusCode !== 201) {
    throw new QueryError('An error happend when try to create query');
  }
  return !response.body || response.body.length < 1 ? {} : JSON.parse(response.body);
};

statusCodeValidator.validateQueryGetStatus = function (response) {
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
};

exports['default'] = statusCodeValidator;
module.exports = exports['default'];
