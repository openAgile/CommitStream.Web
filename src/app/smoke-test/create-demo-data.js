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
  var inboxesToCreate, instance, digest, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, inboxToCreate, inbox, commitAddResponse;

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
          context$1$0.next = 25;
          break;
        }

        inboxToCreate = _step.value;
        context$1$0.next = 16;
        return _regeneratorRuntime.awrap(_libCsApiClient2['default'].postToLink(digest, 'inbox-create', inboxToCreate));

      case 16:
        inbox = context$1$0.sent;
        context$1$0.next = 19;
        return _regeneratorRuntime.awrap(_libCsApiClient2['default'].families[inboxToCreate.family].commitAdd(inbox, 'S-00001 on ' + iteration));

      case 19:
        commitAddResponse = context$1$0.sent;

        console.log('Commit added for inbox ' + inbox.inboxId + ' (' + inbox.family + '):');
        console.log(commitAddResponse.message);

      case 22:
        _iteratorNormalCompletion = true;
        context$1$0.next = 12;
        break;

      case 25:
        context$1$0.next = 31;
        break;

      case 27:
        context$1$0.prev = 27;
        context$1$0.t0 = context$1$0['catch'](10);
        _didIteratorError = true;
        _iteratorError = context$1$0.t0;

      case 31:
        context$1$0.prev = 31;
        context$1$0.prev = 32;

        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }

      case 34:
        context$1$0.prev = 34;

        if (!_didIteratorError) {
          context$1$0.next = 37;
          break;
        }

        throw _iteratorError;

      case 37:
        return context$1$0.finish(34);

      case 38:
        return context$1$0.finish(31);

      case 39:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[10, 27, 31, 39], [32,, 34, 38]]);
};

createInstanceWithData(0);
