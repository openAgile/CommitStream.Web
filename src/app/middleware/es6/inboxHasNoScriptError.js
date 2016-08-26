import CsError from './csError';

class InboxHasNoScriptError extends CsError {
  constructor() {
    super(['This inbox has no script to retrieve.']);
  }
}
 
export default InboxHasNoScriptError;