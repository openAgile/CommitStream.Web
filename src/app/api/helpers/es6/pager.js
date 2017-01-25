import _ from 'underscore';
import uuid from 'uuid-v4';

let pager = {
  getPageSize : query => getConvertedPageSizeOrDefault(query),
  // TODO, not sure if we should really set the cache here or back
  // in the caller...
  getPagedResponse(apiResponse, links, currentPage, buildUri, cache) {
    const guid = uuid();

    let pagedResponse = JSON.parse(JSON.stringify(apiResponse));
    pagedResponse._links = {};

    let nextESPage = _.find(links, el => el.relation === 'next');

    if (nextESPage) {
      cache.set(guid, links[3].uri);
      let previous = buildUri(currentPage);
      let next = buildUri(guid);
      pagedResponse._links = {
        previous,
        next
      };
    }
    return pagedResponse;
  }
}

let hasPageSize = query =>  _.has(query, "pageSize");

let getPageSize = query => query.pageSize;

let convertToInt = stringVal => {
  if (!isNaN(stringVal))
    return parseInt(stringVal);
  else
    return NaN;
};

let getDefaultWhenNaN = (value, defaultValue) => _.isNaN(value)? defaultValue : value;

let getConvertedPageSizeOrDefault = query => {
  const defaultSize = 25;
  if (!hasPageSize(query)) return defaultSize;
  const convertedSize = convertToInt(getPageSize(query));
  return getDefaultWhenNaN(convertedSize, defaultSize);
};

export default pager;