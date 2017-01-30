import digestAdded from './digestAdded';
import digestFormatAsHal from './digestFormatAsHal';
import eventStore from '../helpers/eventStoreClient';
import sanitizeAndValidate from '../sanitizeAndValidate';
import setTimeout from '../helpers/setTimeout';
import config from '../../config';

export default async (req, res) => {
  sanitizeAndValidate('digest', req.body, ['description'], digestAdded);
  const instanceId = req.instance.instanceId;
  const digestAddedEvent = digestAdded.create(instanceId, req.body.description);
  const args = {
    name: `digests-${instanceId}`,
    events: digestAddedEvent
  };

  await eventStore.postToStream(args);
  const hypermedia = digestFormatAsHal(req.href, instanceId, digestAddedEvent.data);
  setTimeout(() => {
    res.hal(hypermedia, 201);
  }, config.controllerResponseDelay);
};
