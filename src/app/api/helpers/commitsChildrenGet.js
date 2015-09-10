'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _config = require('../../config');

var _config2 = _interopRequireDefault(_config);

var _translatorsCommitEventsToApiResponse = require('../translators/commitEventsToApiResponse');

var _translatorsCommitEventsToApiResponse2 = _interopRequireDefault(_translatorsCommitEventsToApiResponse);

var _helpersEventStoreClient = require('../helpers/eventStoreClient');

var _helpersEventStoreClient2 = _interopRequireDefault(_helpersEventStoreClient);

var _helpersPager = require('../helpers/pager');

var _helpersPager2 = _interopRequireDefault(_helpersPager);

var _middlewareCsError = require('../../middleware/csError');

var _middlewareCsError2 = _interopRequireDefault(_middlewareCsError);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var InputRequired = _middlewareCsError2['default'].createCustomError('InputRequired', function (objectType) {
  message = objectType + ' is required';
  var errors = [message];
  NotFound.prototype.constructor.call(this, errors, 400);
});

var validate = function validate(propertyName, property) {
  if (property === undefined || property === null || property === '') throw new InputRequired(propertyName);
};

var getStatus = function getStatus(queryArgs) {
  return _helpersEventStoreClient2['default'].queryGetStatus(queryArgs);
};

var getUntilQueryIsDone = function getUntilQueryIsDone(queryArgs) {
  return _bluebird2['default'].delay(500).then(function () {
    return getStatus(queryArgs);
  }).then(function (response) {
    var status = JSON.parse(response.body).status;
    return status === 'Completed/Stopped/Writing results' ? status : getUntilQueryIsDone(queryArgs);
  });
};

exports['default'] = function (query, stream, buildUri) {
  var args = {
    embed: 'tryharder',
    projection: 'fromStreams(["' + stream.join('", "') + '"]).when({"$init": function(s, e) {return { events: [], keys: {}}},"$any": function(s,e) {  var eventId = JSON.parse(e.linkMetadataRaw).$causedBy; if (!s.keys[eventId]){s.keys[eventId] = true;s.events.unshift(e);}}})'
  };
  return _helpersEventStoreClient2['default'].queryCreate(args).then(function (response) {
    response = JSON.parse(response.body);
    var queryArgs = {
      id: response.name
    };

    return getUntilQueryIsDone(queryArgs).then(function (status) {
      return _helpersEventStoreClient2['default'].queryGetState(queryArgs).then(function (response) {
        var entries = [];
        entries = response.events;
        entries.forEach(function (entry) {
          return entry.data = JSON.stringify(entry.data);
        });
        return (0, _translatorsCommitEventsToApiResponse2['default'])(entries);
      });
    });
  });
};

module.exports = exports['default'];
