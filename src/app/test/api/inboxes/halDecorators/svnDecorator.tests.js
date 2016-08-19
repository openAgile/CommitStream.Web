require('../../handler-base')();

var svnDecorator = require('../../../../api/inboxes/halDecorators/svnDecorator');

var basicSvnHalResponse = {
  "_links": {
    "self": {
      "href": "/api/11111111-1111-4111-1111-111111111111/inboxes/22222222-2222-4222-2222-222222222222"
    },
    "digest-parent": {
      "href": "/api/11111111-1111-4111-1111-111111111111/digests/33333333-3333-4333-3333-333333333333"
    },
    "add-commit": {
      "href": "/api/11111111-1111-4111-1111-111111111111/inboxes/22222222-2222-4222-2222-222222222222/commits"
    },
    "inbox-remove": {
      "href": "/api/11111111-1111-4111-1111-111111111111/inboxes/22222222-2222-4222-2222-222222222222"
    }
  },
  'inboxId': '22222222-2222-4222-2222-222222222222',
  "family": 'Svn',
  "name": 'a random name',
  "url": 'http://random.url.com'
};

var basicNonSvnHalResponse = {
  "_links": {
    "self": {
      "href": "/api/11111111-1111-4111-1111-111111111111/inboxes/22222222-2222-4222-2222-222222222222"
    },
    "digest-parent": {
      "href": "/api/11111111-1111-4111-1111-111111111111/digests/33333333-3333-4333-3333-333333333333"
    },
    "add-commit": {
      "href": "/api/11111111-1111-4111-1111-111111111111/inboxes/22222222-2222-4222-2222-222222222222/commits"
    },
    "inbox-remove": {
      "href": "/api/11111111-1111-4111-1111-111111111111/inboxes/22222222-2222-4222-2222-222222222222"
    }
  },
  'inboxId': '22222222-2222-4222-2222-222222222222',
  "family": 'anything',
  "name": 'a random name',
  "url": 'http://random.url.com'
};

var expected = {
  "_links": {
    "self": {
      "href": "/api/11111111-1111-4111-1111-111111111111/inboxes/22222222-2222-4222-2222-222222222222"
    },
    "digest-parent": {
      "href": "/api/11111111-1111-4111-1111-111111111111/digests/33333333-3333-4333-3333-333333333333"
    },
    "add-commit": {
      "href": "/api/11111111-1111-4111-1111-111111111111/inboxes/22222222-2222-4222-2222-222222222222/commits"
    },
    "inbox-remove": {
      "href": "/api/11111111-1111-4111-1111-111111111111/inboxes/22222222-2222-4222-2222-222222222222"
    }
  },
  'inboxId': '22222222-2222-4222-2222-222222222222',
  "family": 'Svn',
  "name": 'a random name',
  "url": 'http://random.url.com',
  "_embedded": {
    "Svn-scripts":[{
      "_links": {
        "self": {
          "href": "/api/11111111-1111-4111-1111-111111111111/inboxes/22222222-2222-4222-2222-222222222222/script?platform=windows"
        }
      },
      "platform": "windows"
    },
    {
      "_links": {
        "self": {
          "href":"/api/11111111-1111-4111-1111-111111111111/inboxes/22222222-2222-4222-2222-222222222222/script?platform=linux"
        }
      },
      "platform": "linux"
    }]
  }
};

describe('svnDecorator', function() {
  describe('when calling it', function() {
    it('should return the expected value', function() {
      svnDecorator.decorateHalResponse(basicSvnHalResponse).should.deep.equal(expected);
    });
  });

  describe('when asking if it should decorate a svn hal response', function() {
    it('should say that it can', function() {
      svnDecorator.shouldDecorate(basicSvnHalResponse.family).should.equal(true);
    });
  })

  describe('when asking if it should decorate a non-svn hal response', function() {
    it('should say that it can not', function() {
      svnDecorator.shouldDecorate(basicNonSvnHalResponse.family).should.equal(false);
    })
  })
});