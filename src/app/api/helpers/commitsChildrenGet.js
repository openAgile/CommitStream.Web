(function() {
  var config = require('../../config'),
    _ = require('underscore'),
    commitEventsToApiResponse = require('../translators/commitEventsToApiResponse'),
    eventStore = require('../helpers/eventStoreClient'),
    pager = require('../helpers/pager'),
    csError = require('../../middleware/csError'),
    Promise = require('bluebird');

  var InputRequired = csError.createCustomError('InputRequired', function(objectType) {
    message = objectType + ' is required';
    var errors = [message];
    NotFound.prototype.constructor.call(this, errors, 400);
  });

  function validate(propertyName, property) {
    if (property === undefined || property === null || property == '') {
      throw new InputRequired(propertyName);
    }
  }

  module.exports = function(query, stream, buildUri) {
    // validate('stream', stream);
    // validate('buildUri', buildUri);

    // var pageSize = pager.getPageSize(query);
    // var currentPage = cache.get(query.page);

    // var args = {
    //   name: stream,
    //   count: pageSize,
    //   pageUrl: currentPage,
    //   embed: 'tryharder'
    // };
    var getStatus = function(queryArgs) {
      return eventStore.queryGetStatus(queryArgs);
    }

    var getUntilQueryIsDone = function(queryArgs) {
      return Promise.delay(500).then(function() {
          return getStatus(queryArgs);
        })
        .then(function(response) {
          var status = JSON.parse(response.body).status;
          return status === 'Completed/Stopped/Writing results' ?
            status : getUntilQueryIsDone(queryArgs);
        });
    }

    var args = {
      embed: 'tryharder',
      projection: 'fromStreams(["' + stream.join('", "') + '"]).when({"$init": function(s, e) {return { events: [], keys: {}}},"$any": function(s,e) {  var eventId = JSON.parse(e.linkMetadataRaw).$causedBy; if (!s.keys[eventId]){s.keys[eventId] = true;s.events.unshift(e);}}})'
    }
    return eventStore.queryCreate(args)
      .then(function(response) {
        response = JSON.parse(response.body)
        var queryArgs = {
          id: response.name
        }

        return getUntilQueryIsDone(queryArgs).then(function(status) {
          return eventStore.queryGetState(queryArgs)
            .then(function(response) {
              var entries = JSON.parse(response.body).events;
              _.each(entries, function(entry) {
                entry.data = JSON.stringify(entry.data);
              });
              return commitEventsToApiResponse(entries);
            });
        });
      });
  };
}());