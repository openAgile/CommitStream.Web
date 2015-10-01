'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _this = this;

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _libCsApiClient = require('./lib/cs-api-client');

var _libCsApiClient2 = _interopRequireDefault(_libCsApiClient);

_commander2['default'].version('0.0.0').option('-u, --url [url]', 'The base URL for the CommitStream Service API, default: http://localhost:6565/api', 'http://localhost:6565/api').option('-i, --instances [number]', 'Number of instances to create, default: 1', 1).option('-r, --repos [number]', 'Number of repos creation iterations to run (creates one repo per family type during each iteration), default 1', 1).option('-m, --mentions [number]', 'Number of times to post a commit with each mention (one story, 5 tasks, 5 tests in each group of workitems), default 1', 1).option('-d, --debug', 'Show results of each commit, not just summary information').option('-j, --json', 'Log only the JSON output with all the query URLs needed for the performance client').parse(process.argv);

var number_of_instances = parseInt(_commander2['default'].instances);
var number_of_repo_iterations = parseInt(_commander2['default'].repos);
var number_of_mentions_per_workitem_per_repo = parseInt(_commander2['default'].mentions);

var client = new _libCsApiClient2['default'](_commander2['default'].url);

if (!_commander2['default'].json) console.log('Operating against this CommitStream Service API: ' + client.baseUrl);

var workItemsToMention = [['S-00001', 'T-00001', 'T-00002', 'T-00003', 'T-00004', 'T-00005', 'AT-00001', 'AT-00002', 'AT-00003', 'AT-00004', 'AT-00005'], ['S-00002', 'T-00011', 'T-00012', 'T-00013', 'T-00014', 'T-00015', 'AT-00011', 'AT-00012', 'AT-00013', 'AT-00014', 'AT-00015'], ['S-00003', 'T-00021', 'T-00022', 'T-00023', 'T-00024', 'T-00025', 'AT-00021', 'AT-00022', 'AT-00023', 'AT-00024', 'AT-00025']];

var createInstanceWithData = function createInstanceWithData(iteration) {
  var instanceId, apiKey, instance, digests, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _digest, commits, messages, inboxes, inboxesToCreate, digest, n, inboxNum, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, inboxToCreate, inbox, workItemGroupNum, workItemsGroup, comma, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, workItem, mentionNum, message, commitAddResponse;

  return _regeneratorRuntime.async(function createInstanceWithData$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        instanceId = '4ddaa257-bebe-4557-a3dc-14889cc42a91', apiKey = '08ec3bcd-2161-4103-b198-d0351bc5297b';
        context$1$0.next = 3;
        return _regeneratorRuntime.awrap(client.instanceGet(instanceId, apiKey));

      case 3:
        instance = context$1$0.sent;
        context$1$0.next = 6;
        return _regeneratorRuntime.awrap(instance.digestsGet());

      case 6:
        digests = context$1$0.sent;
        _iteratorNormalCompletion = true;
        _didIteratorError = false;
        _iteratorError = undefined;
        context$1$0.prev = 10;
        _iterator = _getIterator(digests);

      case 12:
        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
          context$1$0.next = 28;
          break;
        }

        _digest = _step.value;

        console.log(_digest.description + ' (' + _digest.digestId + ') commits:');
        context$1$0.next = 17;
        return _regeneratorRuntime.awrap(_digest.commitsGet());

      case 17:
        commits = context$1$0.sent;
        messages = commits.commits.map(function (c) {
          return c.message;
        });

        console.log(messages);
        console.log('Inboxes:');
        context$1$0.next = 23;
        return _regeneratorRuntime.awrap(_digest.inboxesGet());

      case 23:
        inboxes = context$1$0.sent;

        console.log(inboxes.resource);

      case 25:
        _iteratorNormalCompletion = true;
        context$1$0.next = 12;
        break;

      case 28:
        context$1$0.next = 34;
        break;

      case 30:
        context$1$0.prev = 30;
        context$1$0.t0 = context$1$0['catch'](10);
        _didIteratorError = true;
        _iteratorError = context$1$0.t0;

      case 34:
        context$1$0.prev = 34;
        context$1$0.prev = 35;

        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }

      case 37:
        context$1$0.prev = 37;

        if (!_didIteratorError) {
          context$1$0.next = 40;
          break;
        }

        throw _iteratorError;

      case 40:
        return context$1$0.finish(37);

      case 41:
        return context$1$0.finish(34);

      case 42:

        console.log("----------");
        context$1$0.t1 = console;
        context$1$0.next = 46;
        return _regeneratorRuntime.awrap(instance.commitsForWorkItemsGet(['AT-00025', 'T-00015']));

      case 46:
        context$1$0.t2 = context$1$0.sent;
        context$1$0.t1.log.call(context$1$0.t1, context$1$0.t2);
        return context$1$0.abrupt('return');

      case 52:
        instance = context$1$0.sent;
        context$1$0.next = 55;
        return _regeneratorRuntime.awrap(instance.digestCreate({ description: 'Digest for ' + iteration }));

      case 55:
        digest = context$1$0.sent;

        if (!_commander2['default'].json) console.log('#' + iteration + ': Populating instance ' + client.instanceId + ' (apiKey = ' + client.apiKey + ')');

        n = 0;

      case 58:
        if (!(n < number_of_repo_iterations)) {
          context$1$0.next = 129;
          break;
        }

        inboxNum = 0;
        _iteratorNormalCompletion2 = true;
        _didIteratorError2 = false;
        _iteratorError2 = undefined;
        context$1$0.prev = 63;
        _iterator2 = _getIterator(inboxesToCreate);

      case 65:
        if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
          context$1$0.next = 112;
          break;
        }

        inboxToCreate = _step2.value;
        context$1$0.next = 69;
        return _regeneratorRuntime.awrap(digest.inboxCreate(inboxToCreate));

      case 69:
        inbox = context$1$0.sent;
        workItemGroupNum = inboxNum % 3;
        workItemsGroup = workItemsToMention[workItemGroupNum];
        comma = iteration === 0 && inboxNum === 0 ? '' : ',';

        inboxNum++;
        if (!_commander2['default'].json) console.log('Adding commits to ' + inbox.inboxId + ' of family ' + inbox.family);else console.log(comma + '"' + client.baseUrl + '/' + client.instanceId + '/commits/tags/versionone/workitem?numbers=' + workItemsGroup.join(',') + '&apiKey=' + client.apiKey + '"');
        _iteratorNormalCompletion3 = true;
        _didIteratorError3 = false;
        _iteratorError3 = undefined;
        context$1$0.prev = 78;
        _iterator3 = _getIterator(workItemsGroup);

      case 80:
        if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
          context$1$0.next = 95;
          break;
        }

        workItem = _step3.value;
        mentionNum = 0;

      case 83:
        if (!(mentionNum < number_of_mentions_per_workitem_per_repo)) {
          context$1$0.next = 92;
          break;
        }

        message = workItem + ' mention # ' + mentionNum + ' on ' + iteration + ' in  ' + inbox.inboxId + ' of family = ' + inbox.family;
        context$1$0.next = 87;
        return _regeneratorRuntime.awrap(inbox.commitCreate(message));

      case 87:
        commitAddResponse = context$1$0.sent;

        if (_commander2['default'].debug) {
          console.log(commitAddResponse.message);
        }

      case 89:
        mentionNum++;
        context$1$0.next = 83;
        break;

      case 92:
        _iteratorNormalCompletion3 = true;
        context$1$0.next = 80;
        break;

      case 95:
        context$1$0.next = 101;
        break;

      case 97:
        context$1$0.prev = 97;
        context$1$0.t3 = context$1$0['catch'](78);
        _didIteratorError3 = true;
        _iteratorError3 = context$1$0.t3;

      case 101:
        context$1$0.prev = 101;
        context$1$0.prev = 102;

        if (!_iteratorNormalCompletion3 && _iterator3['return']) {
          _iterator3['return']();
        }

      case 104:
        context$1$0.prev = 104;

        if (!_didIteratorError3) {
          context$1$0.next = 107;
          break;
        }

        throw _iteratorError3;

      case 107:
        return context$1$0.finish(104);

      case 108:
        return context$1$0.finish(101);

      case 109:
        _iteratorNormalCompletion2 = true;
        context$1$0.next = 65;
        break;

      case 112:
        context$1$0.next = 118;
        break;

      case 114:
        context$1$0.prev = 114;
        context$1$0.t4 = context$1$0['catch'](63);
        _didIteratorError2 = true;
        _iteratorError2 = context$1$0.t4;

      case 118:
        context$1$0.prev = 118;
        context$1$0.prev = 119;

        if (!_iteratorNormalCompletion2 && _iterator2['return']) {
          _iterator2['return']();
        }

      case 121:
        context$1$0.prev = 121;

        if (!_didIteratorError2) {
          context$1$0.next = 124;
          break;
        }

        throw _iteratorError2;

      case 124:
        return context$1$0.finish(121);

      case 125:
        return context$1$0.finish(118);

      case 126:
        n++;
        context$1$0.next = 58;
        break;

      case 129:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[10, 30, 34, 42], [35,, 37, 41], [63, 114, 118, 126], [78, 97, 101, 109], [102,, 104, 108], [119,, 121, 125]]);
};

var run = function run() {
  var instanceNum;
  return _regeneratorRuntime.async(function run$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (_commander2['default'].json) console.log('[');
        instanceNum = 0;

      case 2:
        if (!(instanceNum < number_of_instances)) {
          context$1$0.next = 8;
          break;
        }

        context$1$0.next = 5;
        return _regeneratorRuntime.awrap(createInstanceWithData(instanceNum));

      case 5:
        instanceNum++;
        context$1$0.next = 2;
        break;

      case 8:
        if (_commander2['default'].json) console.log(']');

      case 9:
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
