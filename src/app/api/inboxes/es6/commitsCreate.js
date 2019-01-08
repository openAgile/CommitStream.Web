import validateUUID from  '../validateUUID';
import eventStore from '../helpers/eventStoreClient';
import translatorFactory from '../translators/translatorFactory';
import responderFactory from '../responders/responderFactory';

import commitsAddedFormatAsHal from './commitsAddedFormatAsHal';
import MalformedPushEventError from '../../middleware/malformedPushEventError';

export default (req, res) => {
    const instanceId = req.instance.instanceId;
    const digestId = req.inbox.digestId;
    const inboxId = req.params.inboxId;

    validateUUID('inbox', inboxId);

    const translator = translatorFactory.create(req);

    if (translator) {
        const events = translator.translatePush(req.body, instanceId, digestId, inboxId);
        const postArgs = {
            name: `inboxCommits-${inboxId}`,
            events
        };

        return eventStore.postToStream(postArgs)
            .then(() => {
                const inboxData = {
                    inboxId,
                    digestId
                };

                const hypermedia = commitsAddedFormatAsHal(req.href, instanceId, inboxData);
                res.hal(hypermedia, 201);
            });
    } 
    else { 
        console.log("here in the commitsCreate before I call responderFactory()");
        const responder = responderFactory.create(req);    
        console.log("here in the commitsCreate");
        if (responder) {
        console.log("here in the commitsCreate checking if (responder)");

            responder.respond(res);
        }
        else {
            throw new MalformedPushEventError(req);
        }
    } 
};
