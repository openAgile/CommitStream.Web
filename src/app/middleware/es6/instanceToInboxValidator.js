import CSError from './csError';
import eventStore from '../api/helpers/eventStoreClient';

class InvalidInstanceToInbox extends CSError {
  constructor(instanceId, inboxId) {
    const message = `The inbox ${inboxId} does not exist for instance ${instanceId}.`;
    const errors = [message];
    super(errors, 404);
  }
}

class InstanceToInboxRemoved extends CSError {
  constructor(instanceId, inboxId) {
    const message = `The inbox ${inboxId} has been removed from instance ${instanceId}.`;
    const errors = [message];
    super(errors, 404);
  }
}

export default function(req, res, next, inboxId) {
  eventStore.queryStatePartitionById({
    name: 'inbox',
    id: inboxId
  }).then(function(inbox) {
    if (inbox.eventType === 'InboxRemoved') {
      throw new InstanceToInboxRemoved(req.instance.instanceId, inboxId);
    }
    if (inbox.eventType === 'InboxAdded' && req.instance.instanceId === inbox.data.instanceId) {
      req.inbox = inbox.data;
      next();
    } else {
      throw new InvalidInstanceToInbox(req.instance.instanceId, inboxId);
    }
  });
};