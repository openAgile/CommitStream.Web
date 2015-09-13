(function() {
  var config = require('../../config'),
    _ = require('underscore'),
    commitEventsToApiResponse = require('../translators/commitEventsToApiResponse'),
    eventStore = require('../helpers/eventStoreClient'),
    pager = require('../helpers/pager'),
    CSError = require('../../middleware/csError');

  class InputRequired extends CSError {
    constructor(objectType) {
      const message = objectType + ' is required';
      const errors = [message];
      super(errors);
    }
  };

  function validate(propertyName, property) {
    if (property === undefined || property === null || property == '') {
      throw new InputRequired(propertyName);
    }
  }

  module.exports = function(query, stream, buildUri, cache) {
    validate('stream', stream);
    validate('buildUri', buildUri);

    var pageSize = pager.getPageSize(query);
    var currentPage = cache.get(query.page);

    var args = {
      name: stream,
      count: pageSize,
      pageUrl: currentPage,
      embed: 'tryharder'
    };

    return eventStore.getFromStream(args)
      .then(function(response) {
        var links = response.links;
        var apiResponse = commitEventsToApiResponse(response.entries);
        var pagedResponse = pager.getPagedResponse(apiResponse, links, currentPage, buildUri, cache);
        return pagedResponse;
      }).catch(function(error) {        
        // TODO: not sure how clean this approach is, of totally ignoring ANY error. Maybe it should catch a specific error type...
        return {
          commits: [],
          _links: {}
        };
      });
  };
}());
