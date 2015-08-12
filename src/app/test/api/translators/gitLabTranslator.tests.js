var chai = require('chai'),
  should = chai.should(),
  proxyquire = require('proxyquire'),
  sinon = require('sinon'),
  gitLabTranslator = require('../../../api/translators/gitLabTranslator'),
  GitLabCommitMalformedError = require('../../../middleware/gitLabCommitMalformedError');

describe('gitLabTranslator', function() {

  describe('with appropriate headers', function() {

    var originalHasCorrectHeaders;

    before(function() {
      // Set hasCorrectHeaders to be a stub to ensure it's been called.
      originalHasCorrectHeaders = gitLabTranslator.hasCorrectHeaders;
      gitLabTranslator.hasCorrectHeaders = sinon.stub();
      gitLabTranslator.hasCorrectHeaders.returns(true);
    });

    it('canTranslate should check for appropriate headers', function() {
      var request = {};

      // Act, which should cause the call to hasCorrectHeaders
      gitLabTranslator.canTranslate(request);

      // Check that hasCorrectHeaders was called
      gitLabTranslator.hasCorrectHeaders.should.have.been.calledOnce;
    });

    it('canTranslate should return true when valid headers are available', function() {
      var request = {};

      gitLabTranslator.canTranslate(request).should.equal(true);
    });

    it('should report correct headers if x-gitlab-event header is "Push Hook"', function() {
      var request = {
        'headers': {
          'x-gitlab-event': 'Push Hook'
        }
      }

      gitLabTranslator.hasCorrectHeaders(request.headers).should.equal(true);
    });

    after(function() {
      // reset hasCorrectHeaders back to the real implementation, not our stub.
      gitLabTranslator.hasCorrectHeaders = originalHasCorrectHeaders;
    });
  });

  describe('with incorrect headers', function() {

    var originalHasCorrectHeaders;

    before(function() {

      // Set hasCorrectHeaders to be a stub to ensure it's been called.
      originalHasCorrectHeaders = gitLabTranslator.hasCorrectHeaders;
      gitLabTranslator.hasCorrectHeaders = sinon.stub();
      gitLabTranslator.hasCorrectHeaders.returns(false);
    });

    it('canTranslate should return false when invalid headers are present', function() {
      // What is in the request does not matter for this one, because the component that
      // actually uses the request (gitLabTranslator.hasCorrectHeaders) is being set
      // as a stub for this tests.

      var request = {};
      gitLabTranslator.canTranslate(request).should.equal(false);
    });

    it('should report incorrect headers if x-gitlab-event header is missing', function() {
      var request = {
        'headers': {}
      }

      gitLabTranslator.hasCorrectHeaders(request.headers).should.equal(false);
    });

    it('should report incorrect headers if  x-gitlab-event header is "Tag Push Hook"', function() {
      var request = {
        'headers': {
          'x-gitlab-event': 'Tag Push Hook'
        }
      }

      gitLabTranslator.hasCorrectHeaders(request.headers).should.equal(false);
    });

    it('should report incorrect headers if  x-gitlab-event header is "Issue Hook"', function() {
      var request = {
        'headers': {
          'x-gitlab-event': 'Issue Hook'
        }
      }

      gitLabTranslator.hasCorrectHeaders(request.headers).should.equal(false);
    });

    it('should report incorrect headers if  x-gitlab-event header is "Note Hook"', function() {
      var request = {
        'headers': {
          'x-gitlab-event': 'Note Hook'
        }
      }

      gitLabTranslator.hasCorrectHeaders(request.headers).should.equal(false);
    });

    it('should report incorrect headers if  x-gitlab-event header is "Merge Request Hook"', function() {
      var request = {
        'headers': {
          'x-gitlab-event': 'Merge Request Hook'
        }
      }

      gitLabTranslator.hasCorrectHeaders(request.headers).should.equal(false);
    });

    after(function() {
      // reset hasCorrectHeaders back to the real implementation, not our stub.
      gitLabTranslator.hasCorrectHeaders = originalHasCorrectHeaders;
    });
  });

  describe('with malformed push events', function() {
    it('it should throw a GitLabCommitMalformedError.', function() {
      var invokeTranslatePush = function() {
        var malformedPushEvent = {};
        var instanceId = '73b40eab-bbb9-4478-9031-601b9e701d17',
          digestId = '9c369aef-b041-4a38-a76c-d3cf59dec0d2',
          inboxId = '9c369aef-b041-4a38-a76c-d3cf59dec0d2';

        gitLabTranslator.translatePush(malformedPushEvent, instanceId, digestId, inboxId);
      }

      invokeTranslatePush.should.throw(GitLabCommitMalformedError);
    })
  });
});