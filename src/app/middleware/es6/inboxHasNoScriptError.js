import CsError from './CsError';

class InboxHasNoScriptError extends CsError {
  constructor() {
    super(['This inbox has no script to retrieve.']);
  }
}
 
export default InboxHasNoScriptError;