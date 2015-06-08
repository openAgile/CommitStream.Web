require('../handler-base')();

var instanceFormatAsHal = require('../../../api/instances/instanceFormatAsHal');

var expected = {
  "_links": {
    "self": {
      "href": "/api/instances/11111111-1111-4111-1111-111111111111"
    },
    "digests": {
      "href": "/api/11111111-1111-4111-1111-111111111111/digests"
    },
    "digest-create": {
      "href": "/api/11111111-1111-4111-1111-111111111111/digests",
      "method": "POST",
      "title": "Endpoint for creating a digest on instance 11111111-1111-4111-1111-111111111111."
    }
  },
  "instanceId": "11111111-1111-4111-1111-111111111111",
  "apiKey": "44444444-4444-4444-4444-444444444444"
};

var href = function(input) {
  return input;
};

describe('instanceFormatAsHal', function() {
  describe('when calling it', function() {
    var instance = {
      instanceId: '11111111-1111-4111-1111-111111111111',
      apiKey: '44444444-4444-4444-4444-444444444444'
    };

    it('should return the expected value', function() {
      instanceFormatAsHal(href, instance).should.deep.equal(expected);
    });
  });
});