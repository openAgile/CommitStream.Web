'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _this = this;

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _libCsApiClient = require('./lib/cs-api-client');

var _libCsApiClient2 = _interopRequireDefault(_libCsApiClient);

_commander2['default'].version('0.0.0').option('-u, --url [url]', 'The base URL for the CommitStream Service API, default: http://localhost:6565/api', 'http://localhost:6565/api').parse(process.argv);

var client = new _libCsApiClient2['default'](_commander2['default'].url);

console.log('Operating against this CommitStream Service API: ' + client.baseUrl);

var createInstanceWithDigest = function createInstanceWithDigest() {
  var instance, digest;
  return _regeneratorRuntime.async(function createInstanceWithDigest$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(client.instanceCreate());

      case 2:
        instance = context$1$0.sent;
        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(instance.digestCreate({ description: 'Global Digest' }));

      case 5:
        digest = context$1$0.sent;

        if (!_commander2['default'].json) {
          console.log('The digest: ' + digest._links['teamroom-view'].href + '&apiKey=' + client.apiKey);
          console.log('POST here to create an inbox for this digest: ' + digest._links['inbox-create'].href + '?apiKey=' + client.apiKey);
        }

      case 7:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this);
};

var run = function run() {
  return _regeneratorRuntime.async(function run$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return _regeneratorRuntime.awrap(createInstanceWithDigest());

      case 2:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this);
};
try {
  run();
} catch (e) {
  console.log(e);
}
