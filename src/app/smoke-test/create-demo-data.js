'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _this = this;

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _libCsApiClient = require('./lib/cs-api-client');

var _libCsApiClient2 = _interopRequireDefault(_libCsApiClient);

_commander2['default'].version('0.0.0').option('-u, --url [url]', 'The base URL for the CommitStream Service API, default: http://localhost:6565/api', 'http://localhost:6565/api').option('-i, --instances [number]', 'Number of instances to create, default: 1', 1).option('-r, --repos [number]', 'Number of repos creation iterations to run (creates one repo per family type during each iteration), default 1', 1).option('-m, --mentions [number]', 'Number of times to post a commit with each mention (one story, 5 tasks, 5 tests in each group of workitems), default 1', 1).option('-d, --debug', 'Show results of each commit, not just summary information').parse(process.argv);

var number_of_instances = parseInt(_commander2['default'].instances);
var number_of_repo_iterations = parseInt(_commander2['default'].repos);
var number_of_mentions_per_workitem_per_repo = parseInt(_commander2['default'].mentions);

_libCsApiClient2['default'].baseUrlSet(_commander2['default'].url);

console.log('Operating against this CommitStream Service API: ' + _libCsApiClient2['default'].baseUrlGet());

var workItemsToMention = [['S-00001', 'T-00001', 'T-00002', 'T-00003', 'T-00004', 'T-00005', 'AT-00001', 'AT-00002', 'AT-00003', 'AT-00004', 'AT-00005'], ['S-00002', 'T-00011', 'T-00012', 'T-00013', 'T-00014', 'T-00015', 'AT-00011', 'AT-00012', 'AT-00013', 'AT-00014', 'AT-00015'], ['S-00003', 'T-00021', 'T-00022', 'T-00023', 'T-00024', 'T-00025', 'AT-00021', 'AT-00022', 'AT-00023', 'AT-00024', 'AT-00025']];

var createInstanceWithData = function createInstanceWithData(iteration) {
  var inboxesToCreate, instance, digest, n, inboxNum, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, inboxToCreate, inbox, workItemGroupNum, workItemsGroup, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, workItem, mentionNum, message, commitAddResponse;

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

        console.log('#' + iteration + ': Populating instance ' + _libCsApiClient2['default'].getInstanceId());

        n = 0;

      case 9:
        if (!(n < number_of_repo_iterations)) {
          context$1$0.next = 78;
          break;
        }

        inboxNum = 0;
        _iteratorNormalCompletion = true;
        _didIteratorError = false;
        _iteratorError = undefined;
        context$1$0.prev = 14;
        _iterator = _getIterator(inboxesToCreate);

      case 16:
        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
          context$1$0.next = 61;
          break;
        }

        inboxToCreate = _step.value;
        context$1$0.next = 20;
        return _regeneratorRuntime.awrap(_libCsApiClient2['default'].postToLink(digest, 'inbox-create', inboxToCreate));

      case 20:
        inbox = context$1$0.sent;
        workItemGroupNum = inboxNum % 3;
        workItemsGroup = workItemsToMention[workItemGroupNum];

        console.log('Adding commits to ' + inbox.inboxId + ' of family ' + inbox.family);

        _iteratorNormalCompletion2 = true;
        _didIteratorError2 = false;
        _iteratorError2 = undefined;
        context$1$0.prev = 27;
        _iterator2 = _getIterator(workItemsGroup);

      case 29:
        if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
          context$1$0.next = 44;
          break;
        }

        workItem = _step2.value;
        mentionNum = 0;

      case 32:
        if (!(mentionNum < number_of_mentions_per_workitem_per_repo)) {
          context$1$0.next = 41;
          break;
        }

        message = workItem + ' mention # ' + mentionNum + ' on ' + iteration + ' in  ' + inbox.inboxId + ' of family = ' + inbox.family;
        context$1$0.next = 36;
        return _regeneratorRuntime.awrap(_libCsApiClient2['default'].families[inboxToCreate.family].commitAdd(inbox, message));

      case 36:
        commitAddResponse = context$1$0.sent;

        if (_commander2['default'].debug) {
          console.log(commitAddResponse.message);
        }

      case 38:
        mentionNum++;
        context$1$0.next = 32;
        break;

      case 41:
        _iteratorNormalCompletion2 = true;
        context$1$0.next = 29;
        break;

      case 44:
        context$1$0.next = 50;
        break;

      case 46:
        context$1$0.prev = 46;
        context$1$0.t0 = context$1$0['catch'](27);
        _didIteratorError2 = true;
        _iteratorError2 = context$1$0.t0;

      case 50:
        context$1$0.prev = 50;
        context$1$0.prev = 51;

        if (!_iteratorNormalCompletion2 && _iterator2['return']) {
          _iterator2['return']();
        }

      case 53:
        context$1$0.prev = 53;

        if (!_didIteratorError2) {
          context$1$0.next = 56;
          break;
        }

        throw _iteratorError2;

      case 56:
        return context$1$0.finish(53);

      case 57:
        return context$1$0.finish(50);

      case 58:
        _iteratorNormalCompletion = true;
        context$1$0.next = 16;
        break;

      case 61:
        context$1$0.next = 67;
        break;

      case 63:
        context$1$0.prev = 63;
        context$1$0.t1 = context$1$0['catch'](14);
        _didIteratorError = true;
        _iteratorError = context$1$0.t1;

      case 67:
        context$1$0.prev = 67;
        context$1$0.prev = 68;

        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }

      case 70:
        context$1$0.prev = 70;

        if (!_didIteratorError) {
          context$1$0.next = 73;
          break;
        }

        throw _iteratorError;

      case 73:
        return context$1$0.finish(70);

      case 74:
        return context$1$0.finish(67);

      case 75:
        n++;
        context$1$0.next = 9;
        break;

      case 78:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[14, 63, 67, 75], [27, 46, 50, 58], [51,, 53, 57], [68,, 70, 74]]);
};

var run = function run() {
  var instanceNum;
  return _regeneratorRuntime.async(function run$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        instanceNum = 0;

      case 1:
        if (!(instanceNum < number_of_instances)) {
          context$1$0.next = 7;
          break;
        }

        context$1$0.next = 4;
        return _regeneratorRuntime.awrap(createInstanceWithData(instanceNum));

      case 4:
        instanceNum++;
        context$1$0.next = 1;
        break;

      case 7:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this);
};

run();
