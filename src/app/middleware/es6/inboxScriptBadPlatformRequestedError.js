import CsError from './CsError';

class InboxScriptBadPlatformRequestedError extends CsError {
	constructor() {
		super(['There was expecting Linux or Windows as platform query parameter']);
	}
}

export default InboxScriptBadPlatformRequestedError;