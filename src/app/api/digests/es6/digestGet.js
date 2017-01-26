import digestFormatAsHal from './digestFormatAsHal';
import validateUUID from '../validateUUID';

export default (req, res, next) => {
    validateUUID('digests', req.params.digestId);

    const hypermedia = digestFormatAsHal(req.href, req.params.instanceId, req.digest);
    res.hal(hypermedia);
  };
