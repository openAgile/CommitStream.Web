import CsError from './CsError';

class InboxScriptRetrievedErro extends CsError {
	constructor() {
		super(['There was an unexpected error when retrieving your Svn script.']);
	}
}

export default InboxScriptRetrievedErro;