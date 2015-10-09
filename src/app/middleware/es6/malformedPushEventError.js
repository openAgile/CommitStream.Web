import CsError from './CsError';

class MalformedPushEventError extends CsError {
  constructor(error = 'Push event could not be processed.') {
    super([error]);
  }
}
 
export default MalformedPushEventError;