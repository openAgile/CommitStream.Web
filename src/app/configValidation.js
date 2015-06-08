var config = require('./config'),
  validator = require('validator'),
  EventStore = require('eventstore-client'),
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
      message: 'The config.eventStoreUser value is either not set or is an empty string. Please set it to a valid non-empty string.'
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
      message: 'The config.eventStoreBaseUrl value is ' + config.eventStoreBaseUrl +
        '. You must specify a valid URI using protocol HTTP or HTTPS.'
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
      message: 'The config.eventStoreBaseUrl value is ' + config.eventStoreBaseUrl +
        '. When running in Azure, CommitStream\'s EventStore dependency must operate over HTTPS. ' +
        'Please set the eventStoreBaseUrl value to a valid URI using the HTTPS protocol in the App Settings configuration for the web site.'
    }

    throw new Error(JSON.stringify(errorObj));
  };
}


var configValidation = {
  validateConfig: function() {

    // common validations
    validateEventStoreUserIsSet();
    validateEventStorePasswordIsSet();

    // production validations
    if (config.production) {
      validateProtocolIsHttps();
      validateEventStorePasswordIsGuid();
      validateEventStoreHttpsUri();
    }
    // local validations
    else {
      validateEventStoreUri();
    }
  },
  validateEventStore: function(cb) {
    var es = new EventStore({
      baseUrl: config.eventStoreBaseUrl,
      username: config.eventStoreUser,
      password: config.eventStorePassword
    });

    es.projections.get(function(error, response) {
      if (error || !response || response.statusCode != 200) {
        var errorObj = {
          'error': 'error.fatal.boot.eventStore.connect',
          'message': 'The service was unable to connect to EventStore at the configured address of ' +
            config.eventStoreBaseUrl +
            ' to configure projections. Please verify that EventStore is available at the configured address and is accessible with the configured eventStoreUser and eventStorePassword values.'
        }
        cb(JSON.stringify(errorObj))
      } else {
        cb();
      }
    });
  }
}

module.exports = configValidation;