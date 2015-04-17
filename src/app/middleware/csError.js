(function() {
  var _ = require('underscore'),
    util = require('util'),
    createCustomError = require('custom-error-generator');

  var UNEXPECTED_ERROR_MSG = 'There was an unexpected error when processing your request.';

  var CSError = createCustomError('CSError', null, function(errors, statusCode, internalMessage) {
    this.errors = {
      errors: errors || []
    };
    this.statusCode = statusCode || 400;
    this.internalMessage = internalMessage || null;
    if (this.internalMessage !== null) {
      this.errors = {
        errors: [UNEXPECTED_ERROR_MSG]
      };
    }
  });

  var csError = function(errors, status) {
    var status = status || 400;
    var _errors = [];

    if (_.isArray(errors)) {
      _errors = errors;
    } else if (_.isString(errors)) {
      _errors.push(errors);
    } else {
      _errors.push(UNEXPECTED_ERROR_MSG)
    }

    return new CSError(_errors, status);
  };

  csError.errorHandler = function(err, req, res, next) {
    console.error("\nEXCEPTION RAISED BY API ROUTE: " + util.inspect(req.route, {
      showHidden: true,
      depth: null
    }).substr(0, 5000));
    console.error("STACK TRACE:");
    console.error(err.stack);
    console.error("CAUGHT ERROR DETAILS:");
    console.error(util.inspect(err, {
      showHidden: true,
      depth: null
    }).substr(0, 5000));

    function sendError(error) {
      res.status(error.statusCode).json(error.errors);
    }

    if (err instanceof CSError) {
      sendError(err);
      if (err.internalMessage !== null) {
        console.error("INTERNAL MESSAGE:");
        console.error(err.internalMessage);
      }
    } else {
      sendError(csError([UNEXPECTED_ERROR_MSG], 500));
    }
  };

  csError.createCustomError = function(errorName, ctor, baseErrorCtor) {
    var customError = createCustomError(errorName, null, ctor);
    baseErrorCtor = baseErrorCtor || CSError;
    customError.prototype = Object.create(baseErrorCtor.prototype);
    return customError;
  };

  module.exports = csError;

})();