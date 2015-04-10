(function(statusCodeValidator) {
  var csError = require('../../middleware/csError'),
    Promise = require('bluebird');

  var NotFound = csError.createCustomError('NotFound', function(message) {
    message = message || 'Resource not found';
    var errors = [message];
    NotFound.prototype.constructor.call(this, errors, 404);
  });

  statusCodeValidator.validateGetProjection = function(objectType, objectId) {
    return function(response) {
      if (!response.body || response.body.length < 1 || response.statusCode === 404) {
        throw new NotFound('Could not find ' + objectType + ' with id ' + objectId + '.');
      } else if (response.statusCode != 200) {
        throw new Error(response.statusCode);
      } else {
        var data = JSON.parse(response.body);
        return data;
      }
    };
  };

  var EventStoreClusterFailure = csError.createCustomError('EventStoreClusterFailure', function() {
    EventStoreClusterFailure.prototype.constructor.call(this, null, 500, 'Trouble communicating with eventstore.');
  });

  statusCodeValidator.validateStreamsPost = function() {
    return function(response) {
      if (response.statusCode === 408) {
        throw new EventStoreClusterFailure();
      } else if (response.statusCode !== 201) {
        throw new Error(response.statusCode);
      }
      return true;
    };
  };
}(module.exports));