import eventStore from '../helpers/eventStoreClient';

const RUNNING_STATUS = 'Running';

export default async (req, res) => {
  const response = await eventStore.projections.getAsync();
  const eventStoreResponse = JSON.parse(response.body);

  const nonRunningProjections = eventStoreResponse.projections.filter(
    projection => projection.status !== RUNNING_STATUS
  );

  let projectionStatus = {status: 'healthy'};

  if (nonRunningProjections.length > 0) {
    projectionStatus.status = 'errors';
    projectionStatus.projections = nonRunningProjections;
  }

  res.json(projectionStatus);
};