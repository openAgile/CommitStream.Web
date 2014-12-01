var config = require('./config'),
  validator = require('validator');

function validateProtocolIsHttps() {
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

function validateApiKeyIsSet() {
  if (!config.apiKey) {
    var errorObj = {
      error: 'error.fatal.config.apiKey.invalid',
      message: 'The config.apiKey value is not set. Please set it to a string.'
    };
    throw new Error(JSON.stringify(errorObj));
  };
};

function validateApiKeyLength() {
  if (!config.apiKey || config.apiKey.length < 36) {
    var errorObj = {
      error: 'error.fatal.config.apiKey.invalid',
      message: 'The config.apiKey value is set to a value containing fewer than 36 characters.' +
        'Please set it to a string containing at least 36 characters.'
    };
    throw new Error(JSON.stringify(errorObj));
  };

};

function validateEventStorePasswordIsSet() {
  if (!config.eventStorePassword) {
    var errorObj = {
      error: 'error.fatal.config.eventStorePassword.invalid',
      message: 'The config.eventStorePassword value is not set.' +
        ' Please set it to a string.'
    }
    throw new Error(JSON.stringify(errorObj));
  }
};

function validateEventStorePasswordLength() {
  if (config.eventStorePassword.length < 36) {
    var errorObj = {
      error: 'error.fatal.config.eventStorePassword.invalid',
      message: 'The config.eventStorePassword value is set to a value containing fewer than 36 characters.' +
        ' Please set it to a string containing at least 36 characters.'
    }
    throw new Error(JSON.stringify(errorObj));
  }
};

function validateEventStoreUser() {
  if (!config.eventStoreUser) {
    var errorObj = {
      error: 'error.fatal.config.eventStoreUser.invalid',
      message: 'The config.eventStoreUser value is either not set or is an empty string.Please set it to a valid non - empty string.'
    }

    throw new Error(JSON.stringify(errorObj));
  }
};

function validateEventStoreUri() {
  var options = {
    protocols: ['http', 'https'],
    require_protocol: true
  };

  if (!validator.isURL(config.eventStoreBaseUrl, options)) {
    var errorObj = {
      error: 'error.fatal.config.eventStoreBaseUrl.invalid',
      message: 'The config.eventStoreBaseUrl value is either not set or is set to a value that is not a valid ' +
        'URI using protocol HTTP or HTTPS. Please set it to a valid URI.'
    }

    throw new Error(JSON.stringify(errorObj));
  };
}

function validateHttpsUri() {
  var options = {
    protocols: ['https'],
    require_protocol: true
  };

  if (!validator.isURL(config.eventStoreBaseUrl, options)) {
    var errorObj = {
      error: 'error.fatal.config.eventStoreBaseUrl.invalid.azure',
      message: 'The config.eventStoreBaseUrl value is either not set or is set to a value that is not a valid URI ' +
        'using the required HTTPS protocol. When running in Azure, CommitStream\'s EventStore dependency must operate over HTTPS. ' +
        'Please set the eventStoreBaseUrl value to a valid URI using the HTTPS protocol in the App Settings configuration for the web site.'
    }

    throw new Error(JSON.stringify(errorObj));
  };
}

var validate = function() {

  validateApiKeyIsSet();
  validateEventStoreUri();
  validateEventStoreUser();
  validateEventStorePasswordIsSet();

  if (config.production) {
    validateProtocolIsHttps();
    validateApiKeyIsSet();
    validateApiKeyLength();
    validateEventStorePasswordLength();
    validateHttpsUri();
  }

};

module.exports.validate = validate;