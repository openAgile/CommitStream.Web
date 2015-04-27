require('../handler-base')();

var digestFormatAsHal = require('../../../api/digests/digestFormatAsHal');

var expected = {
  "_links": {
    "self": {
      "href": "/api/872512eb-0d42-41fa-9a4e-fcb480ef265f/digests/ff464ed1-b395-4a4d-8b18-b43f9b3790a9"
    },
    "digests": {
      "href": "/api/872512eb-0d42-41fa-9a4e-fcb480ef265f/digests"
    },
    "inbox-create": {
      "href": "/api/872512eb-0d42-41fa-9a4e-fcb480ef265f/digests/ff464ed1-b395-4a4d-8b18-b43f9b3790a9/inboxes",
      "method": "POST",
      "title": "Endpoint for creating an inbox for a repository on digest ff464ed1-b395-4a4d-8b18-b43f9b3790a9."
    },
    "inboxes": {
      "href": "/api/872512eb-0d42-41fa-9a4e-fcb480ef265f/digests/ff464ed1-b395-4a4d-8b18-b43f9b3790a9/inboxes"
    }
  },
  "description": "some random description",
  "digestId": "ff464ed1-b395-4a4d-8b18-b43f9b3790a9"
};

var instanceId = '872512eb-0d42-41fa-9a4e-fcb480ef265f',
  data = {
    digestId: 'ff464ed1-b395-4a4d-8b18-b43f9b3790a9',
    description: 'some random description'
  };

var href = function(input) {
  return input;
};

describe('digestFormatAsHal', function() {
  describe('when calling it', function() {
    it('should return the expected value', function() {
      digestFormatAsHal(href, instanceId, data).should.deep.equal(expected);
    });
  });
});