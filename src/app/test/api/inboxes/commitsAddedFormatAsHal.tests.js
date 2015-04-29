require('../handler-base')();

var commitsAddedFormatAsHal = require('../../../api/inboxes/commitsAddedFormatAsHal');

var expected = {
  "_links": {
    "self": {
      "href": "/api/11111111-1111-4111-1111-111111111111/inboxes/22222222-2222-4222-2222-222222222222/commits"
    },
    "digest-parent": {
      "href": "/api/11111111-1111-4111-1111-111111111111/digests/33333333-3333-4333-3333-333333333333"
    },
    "digest-query": {
      "href": "/api/11111111-1111-4111-1111-111111111111/digests/33333333-3333-4333-3333-333333333333/commits"
    },
    "instance-query": {
      "href": "/api/11111111-1111-4111-1111-111111111111/commits/tags/versionone/workitems/:workitems"
    }
  },
  "message": "The commits have been added to the CommitStream inbox."
};

var instanceId = '11111111-1111-4111-1111-111111111111',
  data = {
    'digestId': '33333333-3333-4333-3333-333333333333',
    'inboxId': '22222222-2222-4222-2222-222222222222'
  };


var href = function(input) {
  return input;
};

describe('commitsAddedFormatAsHal', function() {
  describe('when calling it', function() {
    it('should return the expected value', function() {
      commitsAddedFormatAsHal(href, instanceId, data).should.deep.equal(expected);
    });
  });
});