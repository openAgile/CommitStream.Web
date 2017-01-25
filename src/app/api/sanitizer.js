'use strict';

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _sanitizeHtml = require('sanitize-html');

var _sanitizeHtml2 = _interopRequireDefault(_sanitizeHtml);

exports['default'] = {
  sanitize: function sanitize(typeName, obj, fields) {
    var errors = [];

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = _getIterator(fields), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var field = _step.value;

        if (obj.hasOwnProperty(field)) {
          var originalValue = obj[field];
          var sanitizedValue = (0, _sanitizeHtml2['default'])(obj[field], { allowedTags: [] });
          obj[field] = sanitizedValue;
          if (originalValue !== sanitizedValue) {
            errors.push(typeName + '.' + field + ' cannot contain script tags or HTML.');
          }
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return errors;
  }
};
module.exports = exports['default'];
