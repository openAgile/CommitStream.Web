(function() {
  var validator = require('validator'),
    csError = require('../middleware/csError');

  var UUIDError = csError.createCustomError('UUIDError', function(errors) {
    UUIDError.prototype.constructor.call(this, errors, 400);
  });

  // TODO: This may need some unit tests around it, not highly important right now.
  module.exports = function(valueType, data) {
    var errors = ["The value " + data + " is not a valid identifier for " + valueType];

    if (!validator.isUUID(data)) {
      throw new UUIDError(errors);
    }
  };
}());