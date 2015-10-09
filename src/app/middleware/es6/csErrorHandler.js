import _ from 'underscore';
import util from 'util';
import CSError from './csError';
import logger from './logger';

export default function errorHandler(err, req, res, next) {
  let body = '';
  if (req.body) body = req.body;
  var errorMessage = {
    level: 'error',
    route: req.route.path,
    url: util.inspect(req.originalUrl),
    headers: util.inspect(req.headers, {
      showHidden: true,
      depth: null
    }),
    body: body,
    stackTrace: err.stack,
    exception: util.inspect(err, {
      showHidden: true,
      depth: null
    }).substr(0, 5000),
    internalMessage: ''
  };

  function sendError(error) {
    res.status(error.statusCode).json(error.errors);
  }

  if (err instanceof CSError) {
    sendError(err);
    if (err.internalMessage !== null) {
      errorMessage.internalMessage = err.internalMessage;
    }
    errorMessage.status = err.statusCode;
    logger.error(JSON.stringify(errorMessage));
  } else {
    sendError(CSError.create(500));
    errorMessage.status = 500;
    logger.error(JSON.stringify(errorMessage));
  }
}
