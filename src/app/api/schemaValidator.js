'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _jsonschema = require('jsonschema');

var _jsonschema2 = _interopRequireDefault(_jsonschema);

var validator = new _jsonschema2['default'].Validator();

exports['default'] = {
  validate: function validate(typeName, data, schema) {
    var result = validator.validate(data, schema, { propertyName: typeName });
    var errors = result.errors.map(function (error) {
      console.log(error);
      return error.property + ' ' + error.message;
    });

    return errors;
  }
};
module.exports = exports['default'];
