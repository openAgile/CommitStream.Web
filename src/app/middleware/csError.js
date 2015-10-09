'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _es6Error = require('es6-error');

var _es6Error2 = _interopRequireDefault(_es6Error);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var UNEXPECTED_ERROR_MSG = 'There was an unexpected error when processing your request.';

var CSError = (function (_ExtendableError) {
  _inherits(CSError, _ExtendableError);

  function CSError() {
    var errors = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
    var statusCode = arguments.length <= 1 || arguments[1] === undefined ? 400 : arguments[1];
    var internalMessage = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    _classCallCheck(this, CSError);

    _get(Object.getPrototypeOf(CSError.prototype), 'constructor', this).call(this);
    this.errors = {
      errors: errors
    };
    this.statusCode = statusCode;
    this.internalMessage = internalMessage;
    if (this.internalMessage !== null) {
      this.errors = {
        errors: [UNEXPECTED_ERROR_MSG]
      };
    }
  }

  _createClass(CSError, null, [{
    key: 'create',
    value: function create(status, errors) {
      if (status === undefined) status = 400;

      var _errors = [];

      if (_underscore2['default'].isArray(errors)) {
        _errors = errors;
      } else if (_underscore2['default'].isString(errors)) {
        _errors.push(errors);
      } else {
        _errors.push(UNEXPECTED_ERROR_MSG);
      }
      return new CSError(_errors, status);
    }
  }]);

  return CSError;
})(_es6Error2['default']);

exports['default'] = CSError;
module.exports = exports['default'];
