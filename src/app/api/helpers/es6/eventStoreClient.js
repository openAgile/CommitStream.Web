import EventStore from 'eventstore-client';
import config from '../../config';
import _ from 'underscore';
import statusCodeValidator from './statusCodeValidator';

const client = new EventStore({
  baseUrl: config.eventStoreBaseUrl,
  username: config.eventStoreUser,
  password: config.eventStorePassword
});

export default Object.assign(client, {
  queryStatePartitionById(args) {
    const partition = args.partition || `${args.name}-${args.id}`;

    const stateArgs = {
      name: args.name,
      partition
    };

    return client.projection.getStateAsync(stateArgs)
      .then(statusCodeValidator.validateGetProjection(args.name, args.id));
  },
  postToStream(args) {
    let events = args.events;
    if (!_.isArray(events)) {
      events = [events];
    }
    events = JSON.stringify(events);

    const postArgs = {
      name: args.name,
      events
    };

    return client.streams.postAsync(postArgs)
      .then(statusCodeValidator.validateStreamsPost);
  },
  getFromStream(args) {
    const getArgs = _.pick(args, 'name', 'count', 'pageUrl', 'embed');

    return client.streams.getAsync(getArgs)
      .then(statusCodeValidator.validateGetStream(args.name));
  },
  queryCreate(args) {
    return client.query.postAsync(args).
      then(statusCodeValidator.validateQueryCreate);
  },
  queryGetState(args) {
    return client.query.getStateAsync(args)
      .then(statusCodeValidator.validateQueryGetState);
  },
  queryGetStatus(args) {
    return client.query.getStatusAsync(args)
      .then(statusCodeValidator.validateQueryGetStatus);
  }
});
