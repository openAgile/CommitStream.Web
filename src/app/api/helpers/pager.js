(function(pager) {
  var _ = require('underscore'),
    uuid = require('uuid-v4');

  var hasPageSize = function(query) {
    return _.has(query, "pageSize");
  };

  var getPageSize = function(query) {
    return query.pageSize;
  };

  var convertToInt = function(stringVal) {
    if (!isNaN(stringVal))
      return parseInt(stringVal);
    else
      return NaN;
  };

  var getDefaultWhenNaN = function(value, defaultValue) {
    if (_.isNaN(value)) {
      return defaultValue;
    } else
      return value;
  };

  var getConvertedPageSizeOrDefault = function(query) {
    var defaultSize = 25;
    if (!hasPageSize(query)) return defaultSize;
    var convertedSize = convertToInt(getPageSize(query));
    return getDefaultWhenNaN(convertedSize, defaultSize);
  };

  pager.getPageSize = function(query) {
    var pageSize = getConvertedPageSizeOrDefault(query);
    return pageSize;
  };

  // TODO, not sure if we should really set the cache here or back
  // in the caller...
  pager.getPagedResponse = function(apiResponse, links, currentPage, buildUri, cache) {
    var guid = uuid();

    var pagedResponse = JSON.parse(JSON.stringify(apiResponse));
    pagedResponse._links = {};

    var nextESPage = _.find(links, function(el) {
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
  };
}(module.exports));