import inboxFormatAsHal from './inboxFormatAsHal';
import validateUUID from '../validateUUID';

export default (req,res) =>{
    const inboxId = req.params.inboxId;
    validateUUID('inbox', inboxId);
    res.hal(inboxFormatAsHal(req.href, req.instance.instanceId, req.inbox));
};