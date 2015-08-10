var chai = require('chai'),
  should = chai.should(),
  proxyquire = require('proxyquire'),
  sinon = require('sinon'),
  gitLabTranslator = require('../../../api/translators/gitLabTranslator');

describe('gitLabTranslator', function() {
  it('should report incorrect headers if x-gitlab-event header is missing', function() {
    var request = {
      'headers': {}
    }

    gitLabTranslator.hasCorrectHeaders(request.headers).should.equal(false);
  });

  it('should report incorrect headers if  x-gitlab-event header is wrong', function() {
    var request = {
      'headers': {
        'x-gitlab-event': 'Wrong Header Value'
      }
    }

    gitLabTranslator.hasCorrectHeaders(request.headers).should.equal(false);
  });

  it('should report correct headers if x-gitlab-event header is Push Hook', function() {
    var request = {
      'headers': {
        'x-gitlab-event': 'Push Hook'
      }
    }

    gitLabTranslator.hasCorrectHeaders(request.headers).should.equal(true);
  });

  describe('with appropriate headers', function() {

    var originalHasCorrectHeaders;
    var request;

    before(function() {
      // What is in the request does not matter for these, because the component that
      // actually uses the request (gitLabTranslator.hasCorrectHeaders) is being set
      // as a stub for these tests.
      request = {};

      // Set hasCorrectHeaders to be a stub to ensure it's been called.
      originalHasCorrectHeaders = gitLabTranslator.hasCorrectHeaders;
      gitLabTranslator.hasCorrectHeaders = sinon.stub();
      gitLabTranslator.hasCorrectHeaders.returns(true);
    });

    it('canTranslate should check for appropriate headers', function() {
      // Act, which should cause the call to hasCorrectHeaders
      gitLabTranslator.canTranslate(request);

      // Check that hasCorrectHeaders was called
      gitLabTranslator.hasCorrectHeaders.should.have.been.calledOnce;
    });

    it('canTranslate should return true when valid headers are available', function() {
      gitLabTranslator.canTranslate(request).should.equal(true);
    });

    after(function() {
      // reset hasCorrectHeaders back to the real implementation, not our stub.
      gitLabTranslator.hasCorrectHeaders = originalHasCorrectHeaders;
    });
  });

  describe('with incorrect headers', function() {

    var originalHasCorrectHeaders;
    var request;

    before(function() {
      // What is in the request does not matter for these, because the component that
      // actually uses the request (gitLabTranslator.hasCorrectHeaders) is being set
      // as a stub for these tests.
      request = {};

      // Set hasCorrectHeaders to be a stub to ensure it's been called.
      originalHasCorrectHeaders = gitLabTranslator.hasCorrectHeaders;
      gitLabTranslator.hasCorrectHeaders = sinon.stub();
      gitLabTranslator.hasCorrectHeaders.returns(false);
    });

    it('canTranslate should return true when valid headers are available', function() {
      gitLabTranslator.canTranslate(request).should.equal(false);
    });

    after(function() {
      // reset hasCorrectHeaders back to the real implementation, not our stub.
      gitLabTranslator.hasCorrectHeaders = originalHasCorrectHeaders;
    });
  });

});