require('../../handler-base')();

var p4vDecorator = require('../../../../api/inboxes/halDecorators/p4vDecorator');

var basicP4vHalResponse = {
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
  "family": 'P4V',
  "name": 'a random name',
  "url": 'http://random.url.com'
};

var basicNonP4vHalResponse = {
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
  "family": 'P4V',
  "name": 'a random name',
  "url": 'http://random.url.com',
  "_embedded": {
    "p4v-scripts":[{
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

describe('p4vDecorator', function() {
  describe('when decorating a hal response', function() {
    it('should modify the hal response with p4v specific things', function() {
      p4vDecorator.decorateHalResponse(basicP4vHalResponse).should.deep.equal(expected);
    });
  });

  describe('when asking if it should decorate a p4v hal response', function() {
    it('should say that it can', function() {
      p4vDecorator.shouldDecorate(basicP4vHalResponse.family).should.equal(true);
    });
  })

  describe('when asking if it should decorate a non-p4v hal response', function() {
    it('should say that it can not', function() {
      p4vDecorator.shouldDecorate(basicNonP4vHalResponse.family).should.equal(false);
    })
  })
});