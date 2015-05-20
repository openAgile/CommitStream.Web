require('../handler-base')();

var inboxFormatAsHal = require('../../../api/inboxes/inboxFormatAsHal');

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
    "remove-inbox": {
      "href": "/api/11111111-1111-4111-1111-111111111111/inboxes/22222222-2222-4222-2222-222222222222"
    }
  },
  'inboxId': '22222222-2222-4222-2222-222222222222',
  "family": 'a random family',
  "name": 'a random name',
  "url": 'http://random.url.com'
};

var instanceId = '11111111-1111-4111-1111-111111111111',
  data = {
    'digestId': '33333333-3333-4333-3333-333333333333',
    'inboxId': '22222222-2222-4222-2222-222222222222',
    "family": 'a random family',
    "name": 'a random name',
    "url": 'http://random.url.com'
  };


var href = function(input) {
  return input;
};

describe('inboxFormatAsHal', function() {
  describe('when calling it', function() {
    it('should return the expected value', function() {
      inboxFormatAsHal(href, instanceId, data).should.deep.equal(expected);
    });
  });
});