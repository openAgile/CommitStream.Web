import EventStore from 'eventstore-client';
import Promise from 'bluebird';
import config from '../../config';

const client = new EventStore({
  baseUrl: config.eventStoreBaseUrl,
  username: config.eventStoreUser,
  password: config.eventStorePassword
});

Promise.promisifyAll(client.streams);
Promise.promisifyAll(client.projections);
Promise.promisifyAll(client.projection);

export default client;