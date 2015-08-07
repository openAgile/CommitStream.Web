var chai = require('chai'),
  should = chai.should(),
  proxyquire = require('proxyquire'),
  sinon = require('sinon'),
  gitLabTranslator = require('../../../api/translators/gitLabTranslator');

describe('gitLabTranslator', function() {
  it('should say it can not translate the request if x-gitlab-event header is missing', function() {
    var request = {
      'headers': {}
    }

    gitLabTranslator.canTranslate(request).should.equal(false);
  });

  it('should say it can not translate the request if x-gitlab-event header is wrong', function() {
    var request = {
      'headers': {
        'x-gitlab-event': 'Wrong Header Value'
      }
    }

    gitLabTranslator.canTranslate(request).should.equal(false);
  });

  it('should say it can translate the request if x-gitlab-event header is Push Hook', function() {
    var request = {
      'headers': {
        'x-gitlab-event': 'Push Hook'
      }
    }

    gitLabTranslator.canTranslate(request).should.equal(true);
  });

})