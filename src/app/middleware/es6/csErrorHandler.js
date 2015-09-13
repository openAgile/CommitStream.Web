import _ from 'underscore';
import util from 'util';
import CSError from './csError';

export default function errorHandler(err, req, res, next) {
  console.error("\nEXCEPTION RAISED BY API ROUTE: " + util.inspect(req.route, {
    showHidden: true,
    depth: null
  }).substr(0, 5000));
  console.error("STACK TRACE:");
  console.error(err.stack);
  console.error("CAUGHT ERROR DETAILS:");
  console.error(util.inspect(err, {
    showHidden: true,
    depth: null
  }).substr(0, 5000));

  function sendError(error) {
    res.status(error.statusCode).json(error.errors);
  }

  if (err instanceof CSError) {
    sendError(err);
    if (err.internalMessage !== null) {
      console.error("INTERNAL MESSAGE:");
      console.error(err.internalMessage);
    }
  } else {
    sendError(CSError.create(500));
  }
}