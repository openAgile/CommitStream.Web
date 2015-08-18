var chai = require('chai'),
  should = chai.should(),
  proxyquire = require('proxyquire'),
  sinon = require('sinon'),
  uuidStub = sinon.stub(),
  bitbucketTranslator = proxyquire('../../../api/translators/bitbucketTranslator', {
    'uuid-v4': uuidStub
  });

describe('bitbucketTranslator', function() {

  describe('with appropriate headers', function() {

    it('canTranslate should return true when valid headers are present', function() {
      var request = {
        headers: {
          'User-Agent': 'Bitbucket-Webhooks/2.0'
        }
      };
      bitbucketTranslator.canTranslate(request).should.equal(true);
    });

    it('canTranslate should return false when invalid headers are present', function() {
      var request = {
        headers: {
          'User-Agent': 'Bitbucket-Webhooks'
        }
      };
      bitbucketTranslator.canTranslate(request).should.equal(false);
    });

    it('canTranslate should return false when user-agent header isn\'t available', function() {
      var request = {
        headers: {}
      };
      bitbucketTranslator.canTranslate(request).should.equal(false);
    });

  });

});
