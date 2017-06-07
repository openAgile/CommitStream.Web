'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _csError = require('./csError');

var _csError2 = _interopRequireDefault(_csError);

var _apiHelpersEventStoreClient = require('../api/helpers/eventStoreClient');

var _apiHelpersEventStoreClient2 = _interopRequireDefault(_apiHelpersEventStoreClient);

var InvalidInstanceToInbox = (function (_CSError) {
  _inherits(InvalidInstanceToInbox, _CSError);

  function InvalidInstanceToInbox(instanceId, inboxId) {
    _classCallCheck(this, InvalidInstanceToInbox);

    var message = 'The inbox ' + inboxId + ' does not exist for instance ' + instanceId + '.';
    var errors = [message];
    _get(Object.getPrototypeOf(InvalidInstanceToInbox.prototype), 'constructor', this).call(this, errors, 404);
  }

  return InvalidInstanceToInbox;
})(_csError2['default']);

var InstanceToInboxRemoved = (function (_CSError2) {
  _inherits(InstanceToInboxRemoved, _CSError2);

  function InstanceToInboxRemoved(instanceId, inboxId) {
    _classCallCheck(this, InstanceToInboxRemoved);

    var message = 'The inbox ' + inboxId + ' has been removed from instance ' + instanceId + '.';
    var errors = [message];
    _get(Object.getPrototypeOf(InstanceToInboxRemoved.prototype), 'constructor', this).call(this, errors, 410);
  }

  return InstanceToInboxRemoved;
})(_csError2['default']);

exports['default'] = function (req, res, next, inboxId) {
  return _apiHelpersEventStoreClient2['default'].queryStatePartitionById({
    name: 'inbox',
    id: inboxId
  }).then(function (inbox) {
    if (inbox.eventType === 'InboxRemoved') {
      throw new InstanceToInboxRemoved(req.instance.instanceId, inboxId);
    }
    if (inbox.eventType === 'InboxAdded' && req.instance.instanceId === inbox.data.instanceId) {
      req.inbox = inbox.data;
      next();
    } else {
      throw new InvalidInstanceToInbox(req.instance.instanceId, inboxId);
    }
  });
};

;
module.exports = exports['default'];
