import instanceFormatAsHal from './instanceFormatAsHal';
import instanceAdded from './instanceAdded';
import eventStore from '../helpers/eventStoreClient';
import setTimeout from '../helpers/setTimeout';
import config from '../../config';

((()=> {
    module.exports = (req, res) => {
        let instanceAddedEvent = instanceAdded.create();
        let args = {
            name: 'instances',
            events: instanceAddedEvent
        };

        eventStore.postToStream(args)
            .then(() => {
                let hypermedia = instanceFormatAsHal(req.href, instanceAddedEvent.data);
                setTimeout(() => {
                    res.hal(hypermedia, 201);
                }, config.controllerResponseDelay);
            });
    };
})())