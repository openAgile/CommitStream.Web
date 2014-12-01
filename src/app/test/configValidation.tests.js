var proxyquire = require('proxyquire'),
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
    configStub.eventStorePassword = '098765432109876543210987654321098765';
    configStub.eventStoreUser = 'admin';
    configStub.eventStoreBaseUrl = 'https://localhost:2113/';
    configStub.production = true;
  });

  describe('validateProtocol', function() {
    it('should raise an exception when the protocol is not https.', function(done) {
      configStub.protocol = 'http';
      expect(configValidation.validate).to.throw(Error);
      done();
    });

    it('should NOT raise an exception when the protocol is https.', function(done) {
      configStub.protocol = 'https';
      expect(configValidation.validate).to.not.throw(Error);
      done();
    });
  });

  describe('validateApiKeyIsSet', function() {
    it('should raise an exception when the apiKey is not set.', function(done) {
      configStub.apiKey = undefined;
      expect(configValidation.validate).to.throw(Error);
      done();
    });

    it('should raise an exception when the apiKey is an empty string.', function(done) {
      configStub.apiKey = '';
      expect(configValidation.validate).to.throw(Error);
      done();
    });

  });

  describe('validateApiKeyLength', function() {
    it('should raise an exception when the apiKey is less than 36 characters long.', function(done) {
      // 35 characters long
      configStub.apiKey = '01234567890123456789012345678901234';
      expect(configValidation.validate).to.throw(Error);
      done();
    });

//updated by SMA
    it('should NOT raise an exception when the apiKey is more than 36 characters long.', function(done) {
      // 40 characters long
      configStub.apiKey = '0123456789012345678901234567890123456789';
      expect(configValidation.validate).to.not.throw(Error);
      done();
    });

//added by SMA
    it('should NOT raise and exception when the apiKey is equal to 36 characters in length.', function(done)) {
      // 36 characters long
      configStub.apiKey = 'jklkifshe543890qwe345790lkjsh9123456';
      expect(configValidation.validate).to.not.throw(Error);
      done();
    });
  });

  describe('validateEventStorePasswordIsSet', function(done) {
    it('should raise an exception when eventStorePassword is not set.', function(done) {
      configStub.eventStorePassword = undefined;
      expect(configValidation.validate).to.throw(Error);
      done();
    });

    it('should raise an exception when eventStorePassword is an empty string.', function(done) {
      configStub.eventStorePassword = '';
      expect(configValidation.validate).to.throw(Error);
      done();
    });

  });

  describe('validateEventStorePasswordLength', function(done) {
    it('should raise an exception when eventStorePassword is less than 36 characters long.', function(done) {
      // 35 characters long
      configStub.eventStorePassword = '09876543210987654321098765432109876';
      expect(configValidation.validate).to.throw(Error);
      done();
    });

//updated by SMA
    it('should NOT raise an exception when eventStorePassword is equal to 36 characters long.', function(done) {
      // 36 characters long
      configStub.eventStorePassword = '098765432109876543210987654321098765';
      expect(configValidation.validate).to.not.throw(Error);
      done();
    });

//added by SMA
    it('should NOT raise an exception when the eventStorePassword is more than 36 characters in length.', function(done) {
      // 39 characters long
      configStub.eventStorePassword = 'iuytrewsdf5678902wdr432ju45klopw12scg@@';
      expect(configValidation.validate).to.not.throw(Error);
      done();
    });

  });

//corrected by SMA -- it statement contained eventStorePassword rather than eventStoreUser
  describe('validateEventStoreUserIsSet', function() {
    it('should raise an exception when eventStoreUser is not set.', function(done) {
      configStub.eventStoreUser = undefined;
      expect(configValidation.validate).to.throw(Error);
      done();
    });

//corrected by SMA -- it statement contained eventStorePassword rather than eventStoreUser
    it('should raise an exception when eventStoreUser is an empty string.', function(done) {
      configStub.eventStoreUser = '';
      expect(configValidation.validate).to.throw(Error);
      done();
    });

//corrected by SMA -- it statement contained eventStorePassword rather than eventStoreUser
    it('should NOT raise an exception when eventStoreUser has a value.', function(done) {
      configStub.eventStoreUser = 'admin';
      expect(configValidation.validate).to.not.throw(Error);
      done();
    });

  });


// SMA ???? here on down
//comments added by SMA
  describe('validateEventStoreUri', function() {
    it('should raise an exception when eventStoreBaseUrl is not a valid URI.', function(done) {
      configStub.production = false;
      //eventStoreBaseURL is undefined
      configStub.eventStoreBaseUrl = undefined;
      expect(configValidation.validate).to.throw(Error);
      //eventStoreBaseURL is empty string
      configStub.eventStoreBaseUrl = '';
      expect(configValidation.validate).to.throw(Error);
      //eventStoreBaseURL is not http or https
      configStub.eventStoreBaseUrl = 'www.localhost.com';
      expect(configValidation.validate).to.throw(Error);
      //eventStoreBaseURL is not https or http
      configStub.eventStoreBaseUrl = 'httpc://localhost:2113';
      expect(configValidation.validate).to.throw(Error);
      //eventStoreBaseURL too many /, but is https
      configStub.eventStoreBaseUrl = 'https:///localhost:2113';;
      expect(configValidation.validate).to.throw(Error);
      done();
    });

    it('should NOT raise an exception when eventStoreBaseUrl is a valid URI.', function(done) {
      configStub.production = false;
      configStub.eventStoreBaseUrl = 'http://localhost:2113';
      expect(configValidation.validate).to.not.throw(Error);
      configStub.eventStoreBaseUrl = 'https://localhost:2113';
      expect(configValidation.validate).to.not.throw(Error);
      configStub.eventStoreBaseUrl = 'http://some.domain.net:2113';
      expect(configValidation.validate).to.not.throw(Error);
      configStub.eventStoreBaseUrl = 'https://some.other.domain:9999';
      expect(configValidation.validate).to.not.throw(Error);
      done();
    });

  });

  describe('validateEventStoreHttpsUri', function() {
    it('should raise an exception when in production mode and eventStoreBaseUrl is not a valid https URI.', function(done) {
      configStub.production = true;
      configStub.eventStoreBaseUrl = 'http://localhost:2113';
      expect(configValidation.validate).to.throw(Error);
      configStub.eventStoreBaseUrl = 'http://some.domain.net:2113';
      expect(configValidation.validate).to.throw(Error);
      //added by SMA
      configStub.eventStoreBaseUrl = 'www.localhost.com:2113';
      expect(configValidation.validate).to.throw(Error);
      done();
    });

    it('should NOT raise an exception when eventStoreBaseUrl is a valid https URI.', function(done) {
      configStub.production = true;
      configStub.eventStoreBaseUrl = 'https://localhost:2113';
      expect(configValidation.validate).to.not.throw(Error);
      configStub.eventStoreBaseUrl = 'https://some.other.domain:9999';
      expect(configValidation.validate).to.not.throw(Error);
      done();
    });
  });

});