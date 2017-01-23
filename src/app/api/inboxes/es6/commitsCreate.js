import validateUUID from  '../validateUUID';
import eventStore from '../helpers/eventStoreClient';
import translatorFactory from '../translators/translatorFactory';
import commitsAddedFormatAsHal from './commitsAddedFormatAsHal';
import MalformedPushEventError from '../../middleware/malformedPushEventError';

((() => {
    module.exports = (req, res) => {
        const instanceId = req.instance.instanceId;
        const digestId = req.inbox.digestId;
        const inboxId = req.params.inboxId;

        validateUUID('inbox', inboxId);

        const translator = translatorFactory.create(req);

        if (translator) {
            const events = translator.translatePush(req.body, instanceId, digestId, inboxId);
            const postArgs = {
                name: `inboxCommits-${inboxId}`,
                events: events
            };

            eventStore.postToStream(postArgs)
                .then(() => {
                    const inboxData = {
                        inboxId: inboxId,
                        digestId: digestId
                    };

                    const hypermedia = commitsAddedFormatAsHal(req.href, instanceId, inboxData);
                    res.hal(hypermedia, 201);
                });
        } else {
            throw new MalformedPushEventError(req);
        }
    };
})());
