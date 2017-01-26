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
  async queryStatePartitionById(args) {
    const partition = args.partition || `${args.name}-${args.id}`;
    const stateArgs = {
      name: args.name,
      partition
    };

    const response = await client.projection.getStateAsync(stateArgs);

    return statusCodeValidator.validateGetProjection(args.name, args.id)(response);
  },
  async postToStream(args) {
    // Stay immutable, bro
    let events = args.events;
    if (!_.isArray(events)) {
      events = [events];
    }
    events = JSON.stringify(events);

    const postArgs = {
      name: args.name,
      events
    };

    const response = await client.streams.postAsync(postArgs);

    return statusCodeValidator.validateStreamsPost(response);
  },
  async getFromStream(args) {
    const getArgs = _.pick(args, 'name', 'count', 'pageUrl', 'embed');

    const response = await client.streams.getAsync(getArgs);

    return statusCodeValidator.validateGetStream(args.name)(response);
  },
  async queryCreate(args) {
    const response = await client.query.postAsync(args);
    statusCodeValidator.validateQueryCreate(response);
  },
  async queryGetState(args) {
    const response = await client.query.getStateAsync(args);
    statusCodeValidator.validateQueryGetState(response);
  },
  async queryGetStatus(args) {
    const response = await client.query.getStatusAsync(args);
    statusCodeValidator.validateQueryGetStatus(response);
  }
});