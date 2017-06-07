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

var InvalidInstanceToDigest = (function (_CSError) {
  _inherits(InvalidInstanceToDigest, _CSError);

  function InvalidInstanceToDigest(instanceId, digestId) {
    _classCallCheck(this, InvalidInstanceToDigest);

    var message = 'The digest ' + digestId + ' does not exist for instance ' + instanceId;
    var errors = [message];
    _get(Object.getPrototypeOf(InvalidInstanceToDigest.prototype), 'constructor', this).call(this, errors, 404);
  }

  return InvalidInstanceToDigest;
})(_csError2['default']);

exports['default'] = function (req, res, next, digestId) {
  return _apiHelpersEventStoreClient2['default'].queryStatePartitionById({
    name: 'digest',
    id: digestId
  }).then(function (digest) {
    if (digest.eventType === 'DigestAdded' && req.instance.instanceId === digest.data.instanceId) {
      req.digest = digest.data;
      next();
    } else {
      throw new InvalidInstanceToDigest(req.instance.instanceId, digestId);
    }
  });
};

;
module.exports = exports['default'];
