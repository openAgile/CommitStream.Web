import CSError from './csError';
import eventStore from '../api/helpers/eventStoreClient';

class InvalidInstanceToDigest extends CSError {
  constructor(instanceId, digestId) {
    const message = `The digest ${digestId} does not exist for instance ${instanceId}`;
    const errors = [message];
    super(errors, 404);
  }
}

export default function(req, res, next, digestId) {
  eventStore.queryStatePartitionById({
    name: 'digest',
    id: digestId
  }).then(function(digest) {
    if (digest.eventType === 'DigestAdded' && req.instance.instanceId === digest.data.instanceId) {
      req.digest = digest.data;
      next();
    } else {
      throw new InvalidInstanceToDigest(req.instance.instanceId, digestId);
    }
  });
};