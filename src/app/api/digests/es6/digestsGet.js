import eventStore from '../helpers/eventStoreClient';
import CSError from '../../middleware/csError';
import digestsFormatAsHal from './digestsFormatAsHal';

export default async (req, res) => {
  const instanceId = req.instance.instanceId;
  const args = {
    name: `digests-${instanceId}`
  };
  try {  
    const digests = await eventStore.getFromStream(args);
    res.hal(digestsFormatAsHal(req.href, instanceId, digests.entries));
  }   
  catch (ex) {
    if (ex instanceof CSError.StreamNotFound){
      res.hal(digestsFormatAsHal(req.href, instanceId));
    }
  } 
};