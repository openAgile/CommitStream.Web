import CsError from './CsError';

class InboxScriptRetrievedError extends CsError {
	constructor() {
		super(['There was an unexpected error when retrieving your Svn script.']);
	}
}

export default InboxScriptRetrievedError;