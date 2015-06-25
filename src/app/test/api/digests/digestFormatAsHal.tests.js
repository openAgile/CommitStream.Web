require('../handler-base')();

var digestFormatAsHal = require('../../../api/digests/digestFormatAsHal');

var expected = {
  "_links": {
    "self": {
      "href": "/api/11111111-1111-4111-1111-111111111111/digests/22222222-2222-4222-2222-222222222222"
    },
    "digests": {
      "href": "/api/11111111-1111-4111-1111-111111111111/digests"
    },
    "inbox-create": {
      "href": "/api/11111111-1111-4111-1111-111111111111/digests/22222222-2222-4222-2222-222222222222/inboxes",
      "method": "POST",
      "title": "Endpoint for creating an inbox for a repository on digest 22222222-2222-4222-2222-222222222222."
    },
    "inboxes": {
      "href": "/api/11111111-1111-4111-1111-111111111111/digests/22222222-2222-4222-2222-222222222222/inboxes"
    },
    "teamroom-view": {
      "href": "/?instanceId=11111111-1111-4111-1111-111111111111&digestId=22222222-2222-4222-2222-222222222222"
    }    
  },
  "description": "some random description",
  "digestId": "22222222-2222-4222-2222-222222222222"
};

var instanceId = '11111111-1111-4111-1111-111111111111',
  data = {
    digestId: '22222222-2222-4222-2222-222222222222',
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