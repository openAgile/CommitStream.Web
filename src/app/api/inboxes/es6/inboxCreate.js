import inboxAdded from './inboxAdded';
import eventStore from '../helpers/eventStoreClient';
import inboxFormatAsHal from './inboxFormatAsHal';
import sanitizeAndValidate from '../sanitizeAndValidate';
import setTimeout from '../helpers/setTimeout';
import config from '../../config';

export default async (req,res) => {
    const digestId = req.params.digestId;
    const instanceId = req.instance.instanceId;

    req.body.digestId = digestId;

    sanitizeAndValidate('inbox', req.body, ['family', 'name', 'url'], inboxAdded);

    const inboxAddedEvent = inboxAdded.create(instanceId, digestId, req.body.family, req.body.name, req.body.url);

    const args = {
        name: `inboxes-${instanceId}`,
        events: inboxAddedEvent
    };

    await eventStore.postToStream(args);
    const hypermedia = inboxFormatAsHal(req.href, instanceId, inboxAddedEvent.data);

    setTimeout(() => {
        res.hal(hypermedia, 201);
    }, config.controllerResponseDelay);
}

