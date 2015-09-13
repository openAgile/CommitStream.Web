'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

(function () {
  var config = require('../../config'),
      _ = require('underscore'),
      commitEventsToApiResponse = require('../translators/commitEventsToApiResponse'),
      eventStore = require('../helpers/eventStoreClient'),
      pager = require('../helpers/pager'),
      CSError = require('../../middleware/csError');

  var InputRequired = (function (_CSError) {
    _inherits(InputRequired, _CSError);

    function InputRequired(objectType) {
      _classCallCheck(this, InputRequired);

      var message = objectType + ' is required';
      var errors = [message];
      _get(Object.getPrototypeOf(InputRequired.prototype), 'constructor', this).call(this, errors);
    }

    return InputRequired;
  })(CSError);

  ;

  function validate(propertyName, property) {
    if (property === undefined || property === null || property == '') {
      throw new InputRequired(propertyName);
    }
  }

  module.exports = function (query, stream, buildUri, cache) {
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

    return eventStore.getFromStream(args).then(function (response) {
      var links = response.links;
      var apiResponse = commitEventsToApiResponse(response.entries);
      var pagedResponse = pager.getPagedResponse(apiResponse, links, currentPage, buildUri, cache);
      return pagedResponse;
    })['catch'](function (error) {
      // TODO: not sure how clean this approach is, of totally ignoring ANY error. Maybe it should catch a specific error type...
      return {
        commits: [],
        _links: {}
      };
    });
  };
})();
