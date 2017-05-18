import CSError from './csError';
import eventStore from '../api/helpers/eventStoreClient';

class InvalidInstanceApiKey extends CSError {
  constructor(instanceId) {
    const message = 'Invalid apiKey for instance ' + instanceId;
    let errors = [message];
    super(errors, 401);
  }
}

export default function(req, res, next, instanceId) {
  return eventStore.queryStatePartitionById({
    name: 'instance',
    id: instanceId
  }).then(function(instance) {      
    if (instance.apiKey === req.query.apiKey
        ||
        instance.apiKey === req.get('Bearer')) {
      req.instance = instance;
      next();
    } else {
      throw new InvalidInstanceApiKey(instanceId);
    }
  });
};