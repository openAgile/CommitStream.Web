import CsError from './CsError';

class InboxHasNotScript extends CsError {
  constructor(error = 'This inbox has not script to retrieve.') {
    super([error]);
  }
}
 
export default InboxHasNotScript;