'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _eventstoreClient = require('eventstore-client');

var _eventstoreClient2 = _interopRequireDefault(_eventstoreClient);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var validateProtocolIsHttps = function validateProtocolIsHttps() {
  if (_config2['default'].protocol != 'https') {
    var errorObj = {
      error: 'error.fatal.config.protocol.invalid.azure',
      message: 'The config.protocol value is ' + _config2['default'].protocol + '. When running in Azure, CommitStream must operate over HTTPS. Please set the protocol value to https in the App Settings configuration for the web site.'
    };
    throw new Error(JSON.stringify(errorObj));
  };
};

var validateEventStorePasswordIsSet = function validateEventStorePasswordIsSet() {
  if (!_config2['default'].eventStorePassword) {
    var errorObj = {
      error: 'error.fatal.config.eventStorePassword.invalid',
      message: 'The config.eventStorePassword value is not set.' + ' Please set it to a string.'
    };
    throw new Error(JSON.stringify(errorObj));
  }
};

var validateEventStorePasswordIsGuid = function validateEventStorePasswordIsGuid() {
  if (!_validator2['default'].isUUID(_config2['default'].eventStorePassword)) {
    var errorObj = {
      error: 'error.fatal.config.eventStorePassword.invalid',
      message: 'The config.eventStorePassword value should be a GUID when running in production.'
    };
    throw new Error(JSON.stringify(errorObj));
  }
};

var validateEventStoreUserIsSet = function validateEventStoreUserIsSet() {
  if (!_config2['default'].eventStoreUser) {
    var errorObj = {
      error: 'error.fatal.config.eventStoreUser.invalid',
      message: 'The config.eventStoreUser value is either not set or is an empty string. Please set it to a valid non-empty string.'
    };
    throw new Error(JSON.stringify(errorObj));
  }
};

var validateEventStoreUri = function validateEventStoreUri() {
  var options = {
    protocols: ['http', 'https'],
    require_protocol: true
  };

  if (!_validator2['default'].isURL(_config2['default'].eventStoreBaseUrl, options)) {
    var errorObj = {
      error: 'error.fatal.config.eventStoreBaseUrl.invalid',
      message: 'The config.eventStoreBaseUrl value is ' + _config2['default'].eventStoreBaseUrl + '. You must specify a valid URI using protocol HTTP or HTTPS.'
    };
    throw new Error(JSON.stringify(errorObj));
  };
};

var validateEventStoreHttpsUri = function validateEventStoreHttpsUri() {
  var options = {
    protocols: ['https'],
    require_protocol: true
  };

  if (!_validator2['default'].isURL(_config2['default'].eventStoreBaseUrl, options)) {
    var errorObj = {
      error: 'error.fatal.config.eventStoreBaseUrl.invalid.azure',
      message: 'The config.eventStoreBaseUrl value is ' + _config2['default'].eventStoreBaseUrl + '. When running in Azure, CommitStream\'s EventStore dependency must operate over HTTPS. Please set the eventStoreBaseUrl value to a valid URI using the HTTPS protocol in the App Settings configuration for the web site.'
    };

    throw new Error(JSON.stringify(errorObj));
  };
};

exports['default'] = {
  validateConfig: function validateConfig() {
    // common validations
    validateEventStoreUserIsSet();
    validateEventStorePasswordIsSet();

    // production validations
    if (_config2['default'].production) {
      validateProtocolIsHttps();
      validateEventStorePasswordIsGuid();
      validateEventStoreHttpsUri();
    }
    // local validations
    else {
        validateEventStoreUri();
      }
  },

  validateEventStore: function validateEventStore(cb) {
    var es = new _eventstoreClient2['default']({
      baseUrl: _config2['default'].eventStoreBaseUrl,
      username: _config2['default'].eventStoreUser,
      password: _config2['default'].eventStorePassword
    });

    es.projections.get(function (error, response) {
      if (error || !response || response.statusCode != 200) {
        var errorObj = {
          'error': 'error.fatal.boot.eventStore.connect',
          'message': 'The service was unable to connect to EventStore at the configured address of ' + _config2['default'].eventStoreBaseUrl + ' to configure projections. Please verify that EventStore is available at the configured address and is accessible with the configured eventStoreUser and eventStorePassword values.'
        };
        cb(JSON.stringify(errorObj));
      } else {
        cb();
      }
    });
  }
};
module.exports = exports['default'];
