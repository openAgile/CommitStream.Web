var proxyquire = require('proxyquire').noPreserveCache(),
  sinon = require('sinon'),
  expect = require('chai').expect,
  configStub = {},
  configValidation = proxyquire('../configValidation', {
    './config': configStub
  });

describe('configValidation', function() {
  //set configStub values that will make all test pass
  beforeEach(function() {
    configStub.protocol = 'https';
    configStub.apiKey = '0123456789012345678901234567890123456789';
    configStub.eventStorePassword = 'F9168C5E-CEB2-4faa-B6BF-329BF39FA1E4';
    configStub.eventStoreUser = 'admin';
    configStub.eventStoreBaseUrl = 'https://localhost:2113/';
    configStub.production = true;
  });

  describe('validateProtocolIsHttps', function() {
    var errorObj = {
      error: 'error.fatal.config.protocol.invalid.azure',
      message: 'The config.protocol value is http.' +
        ' When running in Azure, CommitStream must operate over HTTPS.' +
        ' Please set the protocol value to https in the App Settings configuration for the web site.'
    };

    it('should raise an exception when the protocol is not https.', function(done) {
      configStub.protocol = 'http';
      expect(configValidation.validateConfig).to.throw(JSON.stringify(errorObj));
      done();
    });

    it('should NOT raise an exception when the protocol is https.', function(done) {
      configStub.protocol = 'https';
      expect(configValidation.validateConfig).to.not.throw(Error);
      done();
    });
  });

  describe('validateApiKeyIsSet', function() {
    var errorObj = {
      error: 'error.fatal.config.apiKey.invalid',
      message: 'The config.apiKey value is not set. Please set it to a string.'
    };

    it('should raise an exception when the apiKey is not set.', function(done) {
      configStub.apiKey = undefined;
      expect(function() {
        configValidation.validateConfig();
      }).to.throw(JSON.stringify(errorObj));
      done();
    });

    it('should raise an exception when the apiKey is an empty string.', function(done) {
      configStub.apiKey = '';
      expect(function() {
        configValidation.validateConfig();
      }).to.throw(JSON.stringify(errorObj));
      done();
    });

  });

  describe('validateApiKeyLength', function() {
    it('should raise an exception when the apiKey is less than 36 characters long.', function(done) {
      // 35 characters long
      configStub.apiKey = '01234567890123456789012345678901234';
      expect(configValidation.validateConfig).to.throw(Error);
      done();
    });

    //updated by SMA
    it('should NOT raise an exception when the apiKey is more than 36 characters long.', function(done) {
      // 40 characters long
      configStub.apiKey = '0123456789012345678901234567890123456789';
      expect(configValidation.validateConfig).to.not.throw(Error);
      done();
    });

    //added by SMA
    it('should NOT raise and exception when the apiKey is equal to 36 characters in length.', function(done) {
      // 36 characters long
      configStub.apiKey = 'jklkifshe543890qwe345790lkjsh9123456';
      expect(configValidation.validateConfig).to.not.throw(Error);
      done();
    });
  });

  describe('validateEventStorePasswordIsSet', function(done) {
    it('should raise an exception when eventStorePassword is not set.', function(done) {
      configStub.eventStorePassword = undefined;
      expect(configValidation.validateConfig).to.throw(Error);
      done();
    });

    it('should raise an exception when eventStorePassword is an empty string.', function(done) {
      configStub.eventStorePassword = '';
      expect(configValidation.validateConfig).to.throw(Error);
      done();
    });

  });

  describe('validateEventStorePasswordIsGuid', function(done) {
    it('should NOT raise an exception when eventStorePassword is a GUID.', function(done) {
      configStub.eventStorePassword = 'F9168C5E-CEB2-4faa-B6BF-329BF39FA1E4';
      configStub.production = true;
      expect(configValidation.validateConfig).to.not.throw(Error);
      done();
    });

    it('should raise an exception when eventStorePassword is not a proper GUID.', function(done) {
      configStub.eventStorePassword = 'F9168C5ECE-B2-4faa-B6BF-329BF39FA1E4w'
      configStub.production = true;
      expect(configValidation.validateConfig).to.throw(Error);
      done();
    });
  });

  //corrected by SMA -- it statement contained eventStorePassword rather than eventStoreUser
  describe('validateEventStoreUserIsSet', function() {
    it('should raise an exception when eventStoreUser is not set.', function(done) {
      configStub.eventStoreUser = undefined;
      expect(configValidation.validateConfig).to.throw(Error);
      done();
    });

    //corrected by SMA -- it statement contained eventStorePassword rather than eventStoreUser
    it('should raise an exception when eventStoreUser is an empty string.', function(done) {
      configStub.eventStoreUser = '';
      expect(configValidation.validateConfig).to.throw(Error);
      done();
    });

    //corrected by SMA -- it statement contained eventStorePassword rather than eventStoreUser
    it('should NOT raise an exception when eventStoreUser has a value.', function(done) {
      configStub.eventStoreUser = 'admin';
      expect(configValidation.validateConfig).to.not.throw(Error);
      done();
    });

  });

  //comments added by SMA
  describe('validateEventStoreUri', function() {
    it('should raise an exception when eventStoreBaseUrl is not a valid URI.', function(done) {
      configStub.production = false;
      //eventStoreBaseURL is undefined
      configStub.eventStoreBaseUrl = undefined;
      expect(configValidation.validateConfig).to.throw(Error);
      //eventStoreBaseURL is empty string
      configStub.eventStoreBaseUrl = '';
      expect(configValidation.validateConfig).to.throw(Error);
      //eventStoreBaseURL is not http or https
      configStub.eventStoreBaseUrl = 'www.localhost.com';
      expect(configValidation.validateConfig).to.throw(Error);
      //eventStoreBaseURL is not https or http
      configStub.eventStoreBaseUrl = 'httpc://localhost:2113';
      expect(configValidation.validateConfig).to.throw(Error);
      //eventStoreBaseURL too many /, but is https
      configStub.eventStoreBaseUrl = 'https:///localhost:2113';;
      expect(configValidation.validateConfig).to.throw(Error);
      done();
    });

    it('should NOT raise an exception when eventStoreBaseUrl is a valid URI.', function(done) {
      configStub.production = false;
      configStub.eventStoreBaseUrl = 'http://localhost:2113';
      expect(configValidation.validateConfig).to.not.throw(Error);
      configStub.eventStoreBaseUrl = 'https://localhost:2113';
      expect(configValidation.validateConfig).to.not.throw(Error);
      configStub.eventStoreBaseUrl = 'http://some.domain.net:2113';
      expect(configValidation.validateConfig).to.not.throw(Error);
      configStub.eventStoreBaseUrl = 'https://some.other.domain:9999';
      expect(configValidation.validateConfig).to.not.throw(Error);
      done();
    });

  });

  describe('validateEventStoreHttpsUri', function() {
    it('should raise an exception when in production mode and eventStoreBaseUrl is not a valid https URI.', function(done) {
      configStub.production = true;
      configStub.eventStoreBaseUrl = 'http://localhost:2113';
      expect(configValidation.validateConfig).to.throw(Error);
      configStub.eventStoreBaseUrl = 'http://some.domain.net:2113';
      expect(configValidation.validateConfig).to.throw(Error);
      //added by SMA
      configStub.eventStoreBaseUrl = 'www.localhost.com:2113';
      expect(configValidation.validateConfig).to.throw(Error);
      done();
    });

    it('should NOT raise an exception when eventStoreBaseUrl is a valid https URI.', function(done) {
      configStub.production = true;
      configStub.eventStoreBaseUrl = 'https://localhost:2113';
      expect(configValidation.validateConfig).to.not.throw(Error);
      configStub.eventStoreBaseUrl = 'https://some.other.domain:9999';
      expect(configValidation.validateConfig).to.not.throw(Error);
      done();
    });
  });

  describe('validateEventStore', function() {
    it('should return an error if it cannot connect to the event store server.', function(done) {
      var esStub = function() {
        this.projections = {
          get: function(cb) {
            cb('someError', undefined);
          }
        }
      };

      var v = proxyquire('../configValidation', {
        './config': configStub,
        'eventstore-client': esStub
      });

      v.validateEventStore(function(error) {
        expect(error).to.not.be.undefined;
        done();
      });
    });

    it('should return an error if the response from event store is undefined.', function(done) {
      var esStub = function() {
        this.projections = {
          get: function(cb) {
            cb(null, undefined);
          }
        }
      }

      var v = proxyquire('../configValidation', {
        './config': configStub,
        'eventstore-client': esStub
      });

      v.validateEventStore(function(error) {
        expect(error).to.not.be.undefined;
        done();
      });
    });

    it('should not return an error if it can connect to the event store server.', function(done) {
      var esStub = function() {
        this.projections = {
          get: function(cb) {
            cb(null, {
              statusCode: 200,
              body: 'this is suppose to be a body'
            });
          }
        }
      }

      var v = proxyquire('../configValidation', {
        './config': configStub,
        'eventstore-client': esStub
      });

      v.validateEventStore(function(error) {
        expect(error).to.be.undefined;
        done();
      });
    });
  });

});