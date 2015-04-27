require('../handler-base')();

var digestInboxesFormatAsHal = require('../../../api/digests/digestInboxesFormatAsHal');

describe('digestInboxesFormatAsHal', function() {
  var instanceId = '872512eb-0d42-41fa-9a4e-fcb480ef265f',
    digest = {
      'digestId': 'ff1fdc30-d0e2-465b-b23d-fda510acc1bc',
      'description': 'a test digest'
    },
    state = {
      'inboxes': [{
        'inboxId': 'e70ee98d-cd21-4bfe-a4fe-bbded9ce4584'
      }, {
        'inboxId': 'e70ee98d-cd21-4bfe-a4fe-bbded9ce3298'
      }]
    },
    inboxIds = [{
      'inboxId': 'e70ee98d-cd21-4bfe-a4fe-bbded9ce4584'
    }, {
      'inboxId': 'e70ee98d-cd21-4bfe-a4fe-bbded9ce3298'
    }];

  var halResponse = {
    "_links": {
      "self": {
        "href": "/api/872512eb-0d42-41fa-9a4e-fcb480ef265f/digests/ff1fdc30-d0e2-465b-b23d-fda510acc1bc/inboxes",
      },
      "digest": {
        "href": "/api/872512eb-0d42-41fa-9a4e-fcb480ef265f/digests/ff1fdc30-d0e2-465b-b23d-fda510acc1bc"
      },
      "inbox-create": {
        "href": "/api/872512eb-0d42-41fa-9a4e-fcb480ef265f/digests/ff1fdc30-d0e2-465b-b23d-fda510acc1bc/inboxes",
        "method": "POST",
        "title": "Endpoint for creating an inbox for a repository on digest " + 'ff1fdc30-d0e2-465b-b23d-fda510acc1bc' + "."
      }
    },
    "count": 2,
    "digest": {
      "description": 'a test digest',
      "digestId": 'ff1fdc30-d0e2-465b-b23d-fda510acc1bc'
    },
    "_embedded": {
      "inboxes": [{
        "_links": {
          "inbox-commits": {
            "href": "/api/872512eb-0d42-41fa-9a4e-fcb480ef265f/inboxes/e70ee98d-cd21-4bfe-a4fe-bbded9ce4584/commits",
            "method": "POST"
          },
          "self": {
            "href": "/api/872512eb-0d42-41fa-9a4e-fcb480ef265f/inboxes/e70ee98d-cd21-4bfe-a4fe-bbded9ce4584"
          }
        },
        "inboxId": "e70ee98d-cd21-4bfe-a4fe-bbded9ce4584",
      }, {
        "_links": {
          "inbox-commits": {
            "href": "/api/872512eb-0d42-41fa-9a4e-fcb480ef265f/inboxes/e70ee98d-cd21-4bfe-a4fe-bbded9ce3298/commits",
            "method": "POST"
          },
          "self": {
            "href": "/api/872512eb-0d42-41fa-9a4e-fcb480ef265f/inboxes/e70ee98d-cd21-4bfe-a4fe-bbded9ce3298"
          }
        },
        "inboxId": "e70ee98d-cd21-4bfe-a4fe-bbded9ce3298"
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