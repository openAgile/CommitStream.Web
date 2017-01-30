import eventStore from '../helpers/eventStoreClient';
import CSError from '../../middleware/csError';
import digestInboxesFormatAsHal from './digestInboxesFormatAsHal';
import validateUUID from '../validateUUID';

export default async (req, res) => {
    const digestId = req.params.digestId;
    const instanceId = req.instance.instanceId;
    const digest = req.digest;

    validateUUID('digest', digestId);

    try {  
        const inboxes = await eventStore.queryStatePartitionById({
          name: 'inboxes-for-digest',
          partition: `digestInbox-${digest.digestId}`
        });
        const hypermedia = digestInboxesFormatAsHal(req.href, instanceId, digest, inboxes);
        res.hal(hypermedia);
    }   
    catch (ex) {
      if (ex instanceof CSError.ProjectionNotFound){
      // TODO: log the error?
      const hypermedia = digestInboxesFormatAsHal(req.href, instanceId, digest, {inboxes: {}} );
      res.hal(hypermedia);
      }
    } 


};