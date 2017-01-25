import EventStore from 'eventstore-client';
import config from '../../config';
import _ from 'underscore';
import statusCodeValidator from './statusCodeValidator';

let client = new EventStore({
  baseUrl: config.eventStoreBaseUrl,
  username: config.eventStoreUser,
  password: config.eventStorePassword
});

client.queryStatePartitionById = args => {
  var partition = args.partition || args.name + '-' + args.id;
  var stateArgs = {
    name: args.name,
    partition
  };

  return client.projection.getStateAsync(stateArgs)
    .then(statusCodeValidator.validateGetProjection(args.name, args.id));
}

client.postToStream = args => {
  // Stay immutable, bro
  var events = args.events;
  if (!_.isArray(events)) {
    events = [events];
  }
  events = JSON.stringify(events);

  var postArgs = {
    name: args.name,
    events
  };

  return client.streams.postAsync(postArgs)
    .then(statusCodeValidator.validateStreamsPost);
};

client.getFromStream = args => {
  var getArgs = _.pick(args, 'name', 'count', 'pageUrl', 'embed');

  return client.streams.getAsync(getArgs)
    .then(statusCodeValidator.validateGetStream(args.name));
};

client.queryCreate = args => client.query.postAsync(args)
    .then(statusCodeValidator.validateQueryCreate);

client.queryGetState = args => client.query.getStateAsync(args)
    .then(statusCodeValidator.validateQueryGetState);

client.queryGetStatus = args => client.query.getStatusAsync(args)
    .then(statusCodeValidator.validateQueryGetStatus);

export default client;