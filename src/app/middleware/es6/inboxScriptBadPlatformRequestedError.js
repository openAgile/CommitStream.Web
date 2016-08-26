import CsError from './csError';

class InboxScriptBadPlatformRequestedError extends CsError {
	constructor() {
		super(['Expected linux or windows as platform query parameter']);
	}
}

export default InboxScriptBadPlatformRequestedError;