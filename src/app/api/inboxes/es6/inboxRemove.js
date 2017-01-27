import inboxRemoved from './inboxRemoved';
import eventStore from '../helpers/eventStoreClient';

export default async(req,res) => {
    const instanceId = req.instance.instanceId;
    const digestId = req.inbox.digestId;
    const inboxId = req.params.inboxId;

    const inboxRemovedEvent = inboxRemoved.create(instanceId, digestId, inboxId);

    const args = {
        name: `inboxes-${instanceId}`,
        events: inboxRemovedEvent
    };

    await eventStore.postToStream(args);
    const responseBody = {
        message: `The inbox ${inboxId} has been removed from instance ${instanceId}.`
    };
    res.status(200).json(responseBody);
};