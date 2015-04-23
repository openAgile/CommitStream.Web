(function() {
  var sanitize = require('./sanitizer').sanitize,
      csError = require('../middleware/csError');

  var SanitizationError = csError.createCustomError('SanitizationError', function(errors) {
    SanitizationError.prototype.constructor.call(this, errors, 400);
  });

  var SchemaValidationError = csError.createCustomError('SchemaValidationError', function(errors) {
    SchemaValidationError.prototype.constructor.call(this, errors, 400);
  });  

  module.exports = function(objType, data, fieldsToSanitize, schema) {
    var errors = sanitize(objType, data, fieldsToSanitize);
    if (errors.length > 0) {
      throw new SanitizationError(errors);
    }

    errors = schema.validate(data);
    if (errors.length > 0) {
      throw new SchemaValidationError(errors);
    }
  };
}());