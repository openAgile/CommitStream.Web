import instanceFormatAsHal from './instanceFormatAsHal';
import instanceAdded from './instanceAdded';
import eventStore from '../helpers/eventStoreClient';
import setTimeout from '../helpers/setTimeout';
import config from '../../config';


export default async (req, res) => {
    const instanceAddedEvent = instanceAdded.create();
    const args = {
        name: 'instances',
        events: instanceAddedEvent
    };
    await eventStore.postToStream(args);
    const hypermedia = instanceFormatAsHal(req.href, instanceAddedEvent.data);
    setTimeout(() => {
        res.hal(hypermedia, 201);
    }, config.controllerResponseDelay);
};