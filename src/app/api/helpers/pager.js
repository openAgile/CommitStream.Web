'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _uuidV4 = require('uuid-v4');

var _uuidV42 = _interopRequireDefault(_uuidV4);

var hasPageSize = function hasPageSize(query) {
  return _underscore2['default'].has(query, "pageSize");
};

var getPageSize = function getPageSize(query) {
  return query.pageSize;
};

var convertToInt = function convertToInt(stringVal) {
  if (!isNaN(stringVal)) return parseInt(stringVal);else return NaN;
};

var getConvertedPageSizeOrDefault = function getConvertedPageSizeOrDefault(query) {
  var defaultSize = 25;
  if (!hasPageSize(query)) return defaultSize;
  var convertedSize = convertToInt(getPageSize(query));
  return getDefaultWhenNaN(convertedSize, defaultSize);
};

var getDefaultWhenNaN = function getDefaultWhenNaN(value, defaultValue) {
  return _underscore2['default'].isNaN(value) ? defaultValue : value;
};

var pager = {};

exports['default'] = _Object$assign(pager, {
  getPageSize: function getPageSize(query) {
    return getConvertedPageSizeOrDefault(query);
  },
  // TODO, not sure if we should really set the cache here or back
  // in the caller...
  getPagedResponse: function getPagedResponse(apiResponse, links, currentPage, buildUri, cache) {
    var guid = (0, _uuidV42['default'])();

    var pagedResponse = JSON.parse(JSON.stringify(apiResponse));
    pagedResponse._links = {};

    var nextESPage = _underscore2['default'].find(links, function (el) {
      return el.relation === 'next';
    });

    if (nextESPage) {
      cache.set(guid, links[3].uri);
      var previous = buildUri(currentPage);
      var next = buildUri(guid);
      pagedResponse._links = {
        previous: previous,
        next: next
      };
    }
    return pagedResponse;
  }
});
module.exports = exports['default'];
