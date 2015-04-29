require('../handler-base')();

var digestsFormatAsHal = require('../../../api/digests/digestsFormatAsHal');

var expected = {
  "_links": {
    "self": {
      "href": "/api/11111111-1111-4111-1111-111111111111/digests"
    }
  },
  "count": 2,
  "_embedded": {
    "digests": [{
      "_links": {
        "self": {
          "href": "/api/11111111-1111-4111-1111-111111111111/digests/22222222-2222-4222-2222-222222222222"
        }
      },
      "description": "some random description",
      "digestId": "22222222-2222-4222-2222-222222222222"
    }, {
      "_links": {
        "self": {
          "href": "/api/11111111-1111-4111-1111-111111111111/digests/33333333-3333-4333-3333-333333333333"
        }
      },
      "description": "some other random description",
      "digestId": "33333333-3333-4333-3333-333333333333"
    }]
  }
}

var instanceId = '11111111-1111-4111-1111-111111111111',
  data = [{
    'content': {
      'data': {
        digestId: '22222222-2222-4222-2222-222222222222',
        description: 'some random description'
      }
    }
  }, {
    'content': {
      'data': {
        digestId: '33333333-3333-4333-3333-333333333333',
        description: 'some other random description'
      }
    }
  }];

var href = function(input) {
  return input;
};

describe('digestsFormatAsHal', function() {
  describe('when calling it', function() {
    it('should return the expected value', function() {
      digestsFormatAsHal(href, instanceId, data).should.deep.equal(expected);
    });
  });
});