(function() {
  var csError = require('./csError');

  var MalformedPushEventError = csError.createCustomError('MalformedPushEventError', function() {
    var message = 'Push event could not be processed.';
    var errors = [message];
    MalformedPushEventError.prototype.constructor.call(this, errors, 400);
  });

  module.exports = MalformedPushEventError;
})()