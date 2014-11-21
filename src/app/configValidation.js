var config = require('./config');

// TODO: only on azure
function validateProtocol() {
  if (config.protocol != 'https') {

    var errorObj = {
      error: 'error.fatal.config.protocol.invalid.azure',
      message: 'The config.protocol value is ' + config.protocol +
        '. When running in Azure, CommitStream must operate over HTTPS.' +
        ' Please set the protocol value to https in the App Settings configuration for the web site.'
    };
    throw new Error(JSON.stringify(errorObj));
  };
};

// TODO: only on azure
function validateApiKey() {
  if (!config.apiKey || config.apiKey.length < 36) {
    var errorObj = {
      error: 'error.fatal.config.apiKey.invalid',
      message: 'The config.apiKey value is either not set or is set to a value containing fewer than 36 characters.' +
        'Please set it to a string containing at least 36 characters.'
    };
    throw new Error(JSON.stringify(errorObj));
  }
}

var validate = function() {
  //if (config.validateConfig) only in azure
  validateProtocol();
  validateApiKey();


};

module.exports.validate = validate;