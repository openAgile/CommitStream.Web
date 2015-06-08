(function() {

  var csError = require('../../middleware/csError');

  var GithubEventNotPresent = csError.createCustomError('GithubEventNotPresent', function() {
    var message = 'The header x-github-event is required.';
    var errors = [message];
    GithubEventNotPresent.prototype.constructor.call(this, errors, 400);
  });

  var InvalidGithubEvent = csError.createCustomError('InvalidGithubEvent', function(eventType) {
    var message = 'Invalid x-github-event: ' + eventType;
    var errors = [message];
    InvalidGithubEvent.prototype.constructor.call(this, errors, 400);
  });

  module.exports = function(headers) {
    if (!headers.hasOwnProperty('x-github-event')) {
      throw new GithubEventNotPresent();
    }
    var eventType = headers['x-github-event'];
    if (eventType !== 'push' && eventType !== 'ping') {
      throw new InvalidGithubEvent(eventType);
    }
    return eventType;
  };
}());