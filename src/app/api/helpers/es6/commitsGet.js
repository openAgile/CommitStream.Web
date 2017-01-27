import config from '../../config';
import _ from 'underscore';
import commitEventsToApiResponse from '../translators/commitEventsToApiResponse';
import eventStore from '../helpers/eventStoreClient';
import pager from '../helpers/pager';
import CSError from '../../middleware/csError';

class InputRequired extends CSError {
    constructor(objectType) {
      const message = objectType + ' is required';
      const errors = [message];
      super(errors);
    }
  };

const validate = (propertyName, property) => {
  if (property === undefined || property === null || property == '') {
    throw new InputRequired(propertyName);
  }
}

export default async (query, stream, buildUri, cache)  => {
  validate('stream', stream);
  validate('buildUri', buildUri);

  const pageSize = pager.getPageSize(query);
  const currentPage = cache.get(query.page);
  const args = {
    name: stream,
    count: pageSize,
    pageUrl: currentPage,
    embed: 'tryharder'
  };
  try {
    const response =  await eventStore.getFromStream(args);
    console.log("AAAAAAAAAAAAAA" + response)
    const links = response.links;
    const apiResponse = commitEventsToApiResponse(response.entries);
    const pagedResponse = pager.getPagedResponse(apiResponse, links, currentPage, buildUri, cache);
    return pagedResponse;
  } catch (error) {
    return {
      commits: [],
      _links: {}
    };
  }
};