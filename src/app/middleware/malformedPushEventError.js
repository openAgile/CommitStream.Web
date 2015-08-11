(function() {
  var csError = require('./csError');

  var MalformedPushEventError = csError.createCustomError('MalformedPushEventError', function() {
    var message = 'There are no translators that understand the payload you are sending.';
    var errors = [message];
    MalformedPushEventError.prototype.constructor.call(this, errors, 400);
  });

  module.exports = MalformedPushEventError;
})()