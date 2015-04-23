(function(statusCodeValidator) {
  var csError = require('../../middleware/csError');

  var NotFound = csError.createCustomError('NotFound', function(message) {
    message = message || 'Resource not found';
    var errors = [message];
    NotFound.prototype.constructor.call(this, errors, 404);
  });

  statusCodeValidator.validateGetProjection = function(objectType, objectId) {
    return function(response) {
      if (!response.body || response.body.length < 1 || response.statusCode === 404) {
        throw new NotFound('Could not find ' + objectType + ' with id ' + objectId + '.');
      }
      if (response.statusCode !== 200) {
        throw new Error(response.statusCode);
      }
      // TODO handle ***UNKNOWN** with 200 status code
      var data = JSON.parse(response.body);
      return data;
    };
  };

  var StreamNotFound = csError.createCustomError('StreamNotFound', function(message) {
    message = message || 'Stream not found';
    var errors = [message];
    StreamNotFound.prototype.constructor.call(this, errors, 404);
  });
  csError.StreamNotFound = StreamNotFound;

  statusCodeValidator.validateGetStream = function(streamName) {
    return function(response) {
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
  var EventStoreClusterFailure = csError.createCustomError('EventStoreClusterFailure', function() {
    EventStoreClusterFailure.prototype.constructor.call(this, null, 500, 'Trouble communicating with eventstore.');
  });

  statusCodeValidator.validateStreamsPost = function() {
    return function(response) {
      if (response.statusCode === 408) {
        throw new EventStoreClusterFailure();
      }
      if (response.statusCode !== 201) {
        throw new Error(response.statusCode);
      }
      return true;
    };
  };

}(module.exports));