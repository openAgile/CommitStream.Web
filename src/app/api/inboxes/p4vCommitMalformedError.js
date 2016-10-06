import CsError from './csError';

class P4vCommitMalformedError extends CsError {
	constructor(error, pushEvent) {
		super(['There was an unexpected error when processing your P4 Helix commit event.']);
		this.originalError = error;
		this.pushEvent = pushEvent;
	}
}

export default P4vCommitMalformedError;