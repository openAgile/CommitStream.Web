'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _this = this;

var _libCsApiClient = require('./lib/cs-api-client');

var _libCsApiClient2 = _interopRequireDefault(_libCsApiClient);

//csApiClient.enableLogging(true);

var workItemsToMention = ['S-00001', 'T-00001', 'T-00002', 'T-00003', 'T-00004', 'T-00005', 'AT-00001', 'AT-00002', 'AT-00003', 'AT-00004', 'AT-00005', 'S-00002', 'T-00011', 'T-00012', 'T-00013', 'T-00014', 'T-00015', 'AT-00011', 'AT-00012', 'AT-00013', 'AT-00014', 'AT-00015', 'S-00003', 'T-00021', 'T-00022', 'T-00023', 'T-00024', 'T-00025', 'AT-00021', 'AT-00022', 'AT-00023', 'AT-00024', 'AT-00025'];

var createInstanceWithData = function createInstanceWithData(iteration) {
  var inboxesToCreate, instance, digest, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, inboxToCreate, inbox;

  return _regeneratorRuntime.async(function createInstanceWithData$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        inboxesToCreate = [{
          name: 'GitHub Repo ' + iteration,
          family: 'GitHub'
        }, {
          name: 'GitLab Repo ' + iteration,
          family: 'GitLab'
        }, {
          name: 'Bitbucket Repo ' + iteration,
          family: 'Bitbucket'
        }];
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(_libCsApiClient2['default'].post('/instances', {}));

      case 3:
        instance = context$1$0.sent;
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(_libCsApiClient2['default'].postToLink(instance, 'digest-create', {
          description: 'Digest for ' + iteration
        }));

      case 6:
        digest = context$1$0.sent;
        _iteratorNormalCompletion = true;
        _didIteratorError = false;
        _iteratorError = undefined;
        context$1$0.prev = 10;
        _iterator = _getIterator(inboxesToCreate);

      case 12:
        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
          context$1$0.next = 21;
          break;
        }

        inboxToCreate = _step.value;
        context$1$0.next = 16;
        return _regeneratorRuntime.awrap(_libCsApiClient2['default'].postToLink(digest, 'inbox-create', inboxToCreate));

      case 16:
        inbox = context$1$0.sent;

        console.log(JSON.stringify(inbox));

      case 18:
        _iteratorNormalCompletion = true;
        context$1$0.next = 12;
        break;

      case 21:
        context$1$0.next = 27;
        break;

      case 23:
        context$1$0.prev = 23;
        context$1$0.t0 = context$1$0['catch'](10);
        _didIteratorError = true;
        _iteratorError = context$1$0.t0;

      case 27:
        context$1$0.prev = 27;
        context$1$0.prev = 28;

        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }

      case 30:
        context$1$0.prev = 30;

        if (!_didIteratorError) {
          context$1$0.next = 33;
          break;
        }

        throw _iteratorError;

      case 33:
        return context$1$0.finish(30);

      case 34:
        return context$1$0.finish(27);

      case 35:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[10, 23, 27, 35], [28,, 30, 34]]);
};

createInstanceWithData(0);
