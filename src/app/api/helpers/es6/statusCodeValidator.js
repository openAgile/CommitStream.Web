import csError from '../../middleware/csError';
let ProjectionNotFound = csError.createCustomError('ProjectionNotFound', (message) => {
  message = message || 'Projection not found';
  let errors = [message];
  ProjectionNotFound.prototype.constructor.call(this, errors, 404);
});
csError.ProjectionNotFound = ProjectionNotFound;

let statusCodeValidator = {};

statusCodeValidator.validateGetProjection = (objectType, objectId) => {
  return (response) => {
    if (!response.body || response.body.length < 1 || response.statusCode === 404) {
      throw new ProjectionNotFound('Could not find ' + objectType + ' with id ' + objectId + '.');
    }
    if (response.statusCode !== 200) {
      throw new Error(response.statusCode);
    }
    // TODO handle ***UNKNOWN** with 200 status code
    let data = JSON.parse(response.body);
    return data;
  };
};

let StreamNotFound = csError.createCustomError('StreamNotFound', (message) => {
  message = message || 'Stream not found';
  let errors = [message];
  StreamNotFound.prototype.constructor.call(this, errors, 404);
});
csError.StreamNotFound = StreamNotFound;

statusCodeValidator.validateGetStream = (streamName) => {
  return (response) => {    
    if (!response.body || response.body.length < 1 || response.statusCode === 404) {
      throw new StreamNotFound('Could not find stream with name ' + streamName + '.');
    }
    if (response.statusCode !== 200) {
      throw new Error(response.statusCode);
    }
    let data = JSON.parse(response.body);
    return data;
  };
};

// TODO: should we handle 408 using this specific failure in each case
let EventStoreClusterFailure = csError.createCustomError('EventStoreClusterFailure', () => {
  EventStoreClusterFailure.prototype.constructor.call(this, null, 500, 'Trouble communicating with eventstore.');
});

statusCodeValidator.validateStreamsPost = () => {
  return (response) => {
    if (response.statusCode === 408) {
      throw new EventStoreClusterFailure();
    }
    if (response.statusCode !== 201) {
      throw new Error(response.statusCode);
    }
    return true;
  };
};

let QueryError = csError.createCustomError('QueryError', (message) => {
  message = message || 'Query Error';
  let errors = [message];
  QueryError.prototype.constructor.call(this, errors, 500);
});
csError.QueryError = QueryError;

statusCodeValidator.validateQueryGetState = (response) => {
  if (response.statusCode !== 200) {
    throw new QueryError('An error happend when try to query');
  }
  return (!response.body || response.body.length < 1) ? {
    'events': []
  } : JSON.parse(response.body);
};

statusCodeValidator.validateQueryCreate = (response) => {
  if (response.statusCode !== 201) {
    throw new QueryError('An error happend when try to create query');
  }
  return (!response.body || response.body.length < 1) ? {} : JSON.parse(response.body);
};

statusCodeValidator.validateQueryGetStatus = (response) => {
  if (response.statusCode !== 200) {
    throw new QueryError(`An error happend when try to get the query's status`);
  }
  if (!response.body || response.body.length < 1) {
    throw new QueryError(`An error happend when try to get the query's status`);
  } else {
    let body = JSON.parse(response.body);
    if (body.status === 'Faulted') {
      throw new QueryError(`An error happend when try to get the query's status: Faulted`);
    } else {
      return body;
    }
  }
};




export default statusCodeValidator;
