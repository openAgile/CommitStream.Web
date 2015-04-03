(function(module) {
  module.exports = function(req, res, next) {
    res.sendGenericError = function(messageToLog, statusCode) {
      messageToLog = messageToLog || 'Sending generic error';
      statusCode = statusCode || 500;
      // TODO: don't leave this in past instanceId support sprint!
      // Poor man's error logging for our own debugging purposes for now...
      console.log(statusCode + ': ' + messageToLog);
      return res.status(statusCode).json({
        'errors': ['There was an internal error when trying to process your request.']
      });
    };
    return next();
  };
}(module));