import config from '../../config';
import commitEventsToApiResponse from '../translators/commitEventsToApiResponse';
import eventStore from '../helpers/eventStoreClient';
import pager from '../helpers/pager';
import csError from '../../middleware/csError';
import Promise from 'bluebird';

let InputRequired = csError.createCustomError('InputRequired', function(objectType) {
  message = objectType + ' is required';
  var errors = [message];
  NotFound.prototype.constructor.call(this, errors, 400);
});

let validate = (propertyName, property) => {
  if (property === undefined || property === null || property === '')
    throw new InputRequired(propertyName);
};

let getStatus = queryArgs => eventStore.queryGetStatus(queryArgs);

let getUntilQueryIsDone = queryArgs =>
  Promise.delay(500).then(() => getStatus(queryArgs))
  .then(response => {
    let status = JSON.parse(response.body).status;
    return status === 'Completed/Stopped/Writing results' ?
      status : getUntilQueryIsDone(queryArgs);
  });

export default function(query, stream, buildUri) {
  let args = {
    embed: 'tryharder',
    projection: `fromStreams(["${stream.join('", "')}"]).when({"$init": function(s, e) {return { events: [], keys: {}}},"$any": function(s,e) {  var eventId = JSON.parse(e.linkMetadataRaw).$causedBy; if (!s.keys[eventId]){s.keys[eventId] = true;s.events.unshift(e);}}})`
  };
  return eventStore.queryCreate(args)
    .then(response => {
      response = JSON.parse(response.body);
      let queryArgs = {
        id: response.name
      };

      return getUntilQueryIsDone(queryArgs).then(status => {
        return eventStore.queryGetState(queryArgs)
          .then(response => {
            let entries = [];
            entries = response.events;
            entries.forEach(entry => entry.data = JSON.stringify(entry.data));
            return commitEventsToApiResponse(entries);
          });
      });
    });
}
