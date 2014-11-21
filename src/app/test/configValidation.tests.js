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

  describe('validateApiKey', function() {
    it('should raise an exception when the apiKey is not set', function(done) {
      configStub.apiKey = undefined;
      expect(configValidation.validate).to.throw(Error);
      done();
    });

    it('should raise an exception when the apiKey is empty', function(done) {
      configStub.apiKey = '';
      expect(configValidation.validate).to.throw(Error);
      done();
    });

    it('should raise an exception when the apiKey is less than 36 characters long.', function(done) {
      // 35 characters long
      configStub.apiKey = '01234567890123456789012345678901234';
      expect(configValidation.validate).to.throw(Error);
      done();
    });

    it('should NOT raise an exception when the apiKey is equal or more than 36 characters long.', function(done) {
      configStub.apiKey = '0123456789012345678901234567890123456789';
      expect(configValidation.validate).to.not.throw(Error);
      done();
    });
  })

});