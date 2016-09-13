import CsError from './csError';

class MalformedPushEventError extends CsError {
  constructor(error = 'Push event could not be processed.') {
    super(['Push event could not be processed.']);
    this.originalError = error;
  }
}
 
export default MalformedPushEventError;