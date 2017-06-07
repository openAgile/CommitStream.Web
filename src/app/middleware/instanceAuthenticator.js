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

var InvalidInstanceApiKey = (function (_CSError) {
  _inherits(InvalidInstanceApiKey, _CSError);

  function InvalidInstanceApiKey(instanceId) {
    _classCallCheck(this, InvalidInstanceApiKey);

    var message = 'Invalid apiKey for instance ' + instanceId;
    var errors = [message];
    _get(Object.getPrototypeOf(InvalidInstanceApiKey.prototype), 'constructor', this).call(this, errors, 401);
  }

  return InvalidInstanceApiKey;
})(_csError2['default']);

exports['default'] = function (req, res, next, instanceId) {
  return _apiHelpersEventStoreClient2['default'].queryStatePartitionById({
    name: 'instance',
    id: instanceId
  }).then(function (instance) {
    if (instance.apiKey === req.query.apiKey || instance.apiKey === req.get('Bearer')) {
      req.instance = instance;
      next();
    } else {
      throw new InvalidInstanceApiKey(instanceId);
    }
  });
};

;
module.exports = exports['default'];
