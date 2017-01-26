import uuid from 'uuid-v4';

export default {
    create (instanceId, digestId, inboxId) {
        const eventId = uuid();
        return {
            eventType: 'InboxRemoved',
            eventId,
            data: {
                instanceId,
                digestId,
                inboxId
            }
        };
    }
};