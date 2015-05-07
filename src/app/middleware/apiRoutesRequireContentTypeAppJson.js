(function() {
  var csError = require('./csError');

  var UnsupportedMediaType = csError.createCustomError('UnsupportedMediaType', function(message) {
    message = message || 'The Content-Type header is unspecified or invalid';
    var errors = [message];
    UnsupportedMediaType.prototype.constructor.call(this, errors, 415);
  });  

	module.exports = function(req, res, next) {    
    if (req.method !== 'POST') { 
      return next();
    }
    if (/api\/.*?\/inboxes\/.*?\/commits/.test(req.path)) {
      return next();
    }
    if (!req.is('application/json')) {
      throw new UnsupportedMediaType('When issuing a POST to the CommitStream API, you must send a Content-Type: application/json header.');
    } 
    return next();
  };
}());