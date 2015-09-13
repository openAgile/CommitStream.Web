'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _sanitizer = require('./sanitizer');

var _middlewareCsError = require('../middleware/csError');

var _middlewareCsError2 = _interopRequireDefault(_middlewareCsError);

var SanitizationError = (function (_CSError) {
  _inherits(SanitizationError, _CSError);

  function SanitizationError(errors) {
    _classCallCheck(this, SanitizationError);

    _get(Object.getPrototypeOf(SanitizationError.prototype), 'constructor', this).call(this, errors);
  }

  return SanitizationError;
})(_middlewareCsError2['default']);

var SchemaValidationError = (function (_CSError2) {
  _inherits(SchemaValidationError, _CSError2);

  function SchemaValidationError(errors) {
    _classCallCheck(this, SchemaValidationError);

    _get(Object.getPrototypeOf(SchemaValidationError.prototype), 'constructor', this).call(this, errors);
  }

  return SchemaValidationError;
})(_middlewareCsError2['default']);

exports['default'] = function (objType, data, fieldsToSanitize, schema) {
  var errors = (0, _sanitizer.sanitize)(objType, data, fieldsToSanitize);
  if (errors.length > 0) {
    throw new SanitizationError(errors);
  }

  errors = schema.validate(data);
  if (errors.length > 0) {
    throw new SchemaValidationError(errors);
  }
};

;
module.exports = exports['default'];
