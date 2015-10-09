'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _middlewareCsError = require('../middleware/csError');

var _middlewareCsError2 = _interopRequireDefault(_middlewareCsError);

var UUIDError = (function (_CSError) {
  _inherits(UUIDError, _CSError);

  function UUIDError() {
    _classCallCheck(this, UUIDError);

    _get(Object.getPrototypeOf(UUIDError.prototype), 'constructor', this).apply(this, arguments);
  }

  // TODO: This may need some unit tests around it, not highly important right now.
  return UUIDError;
})(_middlewareCsError2['default']);

exports['default'] = function (valueType, data) {
  var errors = ['The value ' + data + ' is not a valid identifier for ' + valueType];
  if (!_validator2['default'].isUUID(data)) {
    throw new UUIDError(errors);
  }
};

;
module.exports = exports['default'];
