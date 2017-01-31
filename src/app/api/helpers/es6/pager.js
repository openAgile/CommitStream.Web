import _ from 'underscore';
import uuid from 'uuid-v4';

const hasPageSize = query =>  _.has(query, "pageSize");

const getPageSize = query => query.pageSize;

const convertToInt = stringVal => {
  if (!isNaN(stringVal))
    return parseInt(stringVal);
  else
    return NaN;
};

const getConvertedPageSizeOrDefault = query => {
  const defaultSize = 25;
  if (!hasPageSize(query)) return defaultSize;
  const convertedSize = convertToInt(getPageSize(query));
  return getDefaultWhenNaN(convertedSize, defaultSize);
};

const getDefaultWhenNaN = (value, defaultValue) => _.isNaN(value)? defaultValue : value;

const pager = {};

export default Object.assign(pager, {
  getPageSize : query => getConvertedPageSizeOrDefault(query),
  // TODO, not sure if we should really set the cache here or back
  // in the caller...
  getPagedResponse(apiResponse, links, currentPage, buildUri, cache) {
    const guid = uuid();

    let pagedResponse = JSON.parse(JSON.stringify(apiResponse));
    pagedResponse._links = {};

    const nextESPage = _.find(links, el => el.relation === 'next');

    if (nextESPage) {
      cache.set(guid, links[3].uri);
      const previous = buildUri(currentPage);
      const next = buildUri(guid);
      pagedResponse._links = {
        previous,
        next
      };
    }
    return pagedResponse;
  }
});