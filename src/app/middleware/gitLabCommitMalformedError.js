(function() {
  var csError = require('./csError');

  var GitLabCommitMalformedError = csError.createCustomError('GitLabCommitMalformedError', function(error, pushEvent) {
    var message = 'There was an unexpected error when processing your GitLab push event.';
    var errors = [message];
    GitLabCommitMalformedError.prototype.constructor.call(this, errors, 400);
  });

  module.exports = GitLabCommitMalformedError;
})()