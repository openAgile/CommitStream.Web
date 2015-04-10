(function(statusCodeValidator) {
  var csError = require('../middleware/csError'),
      Promise = require('bluebird');

  var NotFound = csError.createCustomError('NotFound', function(message) {
    message = message || 'Resource not found';
    var errors = [message];
    NotFound.prototype.constructor.call(this, errors, 404);
    this.name = 'NotFound';
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
}(module.exports));