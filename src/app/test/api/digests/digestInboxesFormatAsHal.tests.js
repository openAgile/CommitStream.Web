require('../handler-base')();

var digestInboxesFormatAsHal = require('../../../api/digests/digestInboxesFormatAsHal');

describe('digestInboxesFormatAsHal', function() {
  var instanceId = '11111111-1111-4111-1111-111111111111',
    digest = {
      'digestId': '22222222-2222-4222-2222-222222222222',
      'description': 'a test digest'
    },
    state = {
      'inboxes': [{
        'inboxId': '33333333-3333-4333-3333-333333333333'
      }, {
        'inboxId': '55555555-5555-4555-5555-555555555555'
      }]
    },
    inboxIds = [{
      'inboxId': '33333333-3333-4333-3333-333333333333'
    }, {
      'inboxId': '55555555-5555-4555-5555-555555555555'
    }];

  var halResponse = {
    "_links": {
      "self": {
        "href": "/api/11111111-1111-4111-1111-111111111111/digests/22222222-2222-4222-2222-222222222222/inboxes",
      },
      "digest": {
        "href": "/api/11111111-1111-4111-1111-111111111111/digests/22222222-2222-4222-2222-222222222222"
      },
      "inbox-create": {
        "href": "/api/11111111-1111-4111-1111-111111111111/digests/22222222-2222-4222-2222-222222222222/inboxes",
        "method": "POST",
        "title": "Endpoint for creating an inbox for a repository on digest " + '22222222-2222-4222-2222-222222222222' + "."
      }
    },
    "count": 2,
    "digest": {
      "description": 'a test digest',
      "digestId": '22222222-2222-4222-2222-222222222222'
    },
    "_embedded": {
      "inboxes": [{
        "_links": {
          "add-commit": {
            "href": "/api/11111111-1111-4111-1111-111111111111/inboxes/33333333-3333-4333-3333-333333333333/commits"
          },
          "self": {
            "href": "/api/11111111-1111-4111-1111-111111111111/inboxes/33333333-3333-4333-3333-333333333333"
          }
        },
        "inboxId": "33333333-3333-4333-3333-333333333333",
      }, {
        "_links": {
          "add-commit": {
            "href": "/api/11111111-1111-4111-1111-111111111111/inboxes/55555555-5555-4555-5555-555555555555/commits"
          },
          "self": {
            "href": "/api/11111111-1111-4111-1111-111111111111/inboxes/55555555-5555-4555-5555-555555555555"
          }
        },
        "inboxId": "55555555-5555-4555-5555-555555555555"
      }]
    }
  };

  var href = function(input) {
    return input;
  };

  describe('when calling it', function() {
    it('should create hal response with the proper structure', function() {
      digestInboxesFormatAsHal(href, instanceId, digest, state).should.deep.equal(halResponse);
    });
  });
});