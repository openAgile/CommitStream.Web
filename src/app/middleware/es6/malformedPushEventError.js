import CsError from './csError';

class MalformedPushEventError extends CsError {
  constructor(error = 'Push event could not be processed.') {
    super([error]);
    this.originalError = error;
  }
}
 
export default MalformedPushEventError;