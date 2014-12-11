var config = require('./config'),
  validator = require('validator'),
  request = require('request');

var validateProtocolIsHttps = function() {
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

var validateApiKeyIsSet = function() {
  if (!config.apiKey) {
    var errorObj = {
      error: 'error.fatal.config.apiKey.invalid',
      message: 'The config.apiKey value is not set. Please set it to a string.'
    };
    throw new Error(JSON.stringify(errorObj));
  };
};

var validateApiKeyLength = function() {
  if (!config.apiKey || config.apiKey.length < 36) {
    var errorObj = {
      error: 'error.fatal.config.apiKey.invalid',
      message: 'The config.apiKey value is set to a value containing fewer than 36 characters.' +
        'Please set it to a string containing at least 36 characters.'
    };
    throw new Error(JSON.stringify(errorObj));
  };

};

var validateEventStorePasswordIsSet = function() {
  if (!config.eventStorePassword) {
    var errorObj = {
      error: 'error.fatal.config.eventStorePassword.invalid',
      message: 'The config.eventStorePassword value is not set.' +
        ' Please set it to a string.'
    }
    throw new Error(JSON.stringify(errorObj));
  }
};

var validateEventStorePasswordLength = function() {
  if (config.eventStorePassword.length < 36) {
    var errorObj = {
      error: 'error.fatal.config.eventStorePassword.invalid',
      message: 'The config.eventStorePassword value is set to a value containing fewer than 36 characters.' +
        ' Please set it to a string containing at least 36 characters.'
    }
    throw new Error(JSON.stringify(errorObj));
  }
};

var validateEventStorePasswordIsGuid = function() {
  if (!validator.isUUID(config.eventStorePassword)) {
    var errorObj = {
      error: 'error.fatal.config.eventStorePassword.invalid',
      message: 'The config.eventStorePassword value should be a GUID when running in production.'
    }
    throw new Error(JSON.stringify(errorObj));
  }
};

var validateEventStoreUserIsSet = function() {
  if (!config.eventStoreUser) {
    var errorObj = {
      error: 'error.fatal.config.eventStoreUser.invalid',
      message: 'The config.eventStoreUser value is either not set or is an empty string. Please set it to a valid non - empty string.'
    }

    throw new Error(JSON.stringify(errorObj));
  }
};

var validateEventStoreUri = function() {
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

var validateEventStoreHttpsUri = function() {
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


var configValidation = {
  validateConfig: function() {

    // common validations
    validateApiKeyIsSet();
    validateEventStoreUserIsSet();
    validateEventStorePasswordIsSet();

    // production validations
    if (config.production) {
      validateProtocolIsHttps();
      validateApiKeyIsSet();
      validateApiKeyLength();
      validateEventStorePasswordLength();
      validateEventStorePasswordIsGuid();
      validateEventStoreHttpsUri();
    }
    // local validations
    else {
      validateEventStoreUri();
    }
  },
  validateEventStore: function(cb) {

    var options = {
      rejectUnauthorized: false,
      url: config.eventStoreBaseUrl + '/projections/all-non-transient',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Basic ' + new Buffer(config.eventStoreUser + ':' + config.eventStorePassword).toString('base64')
      }
    };
    // TODO: once we refactor to use eventstore-client library
    request.get(options, function(error, response) {
      if (error || !response || response.statusCode != 200) {
        var errorObj = {
          'error': 'error.fatal.boot.eventStore.connect',
          'message': 'The service was unable to connect to EventStore at the configured address of <config.eventStoreBaseUrl> to configure projections. Please verify that EventStore is available at the configured address and is accessible with the configured eventStoreUser and eventStorePassword values.'
        }
        cb(JSON.stringify(errorObj))
      } else {
        cb();
      }
    });
  }
}

module.exports = configValidation;