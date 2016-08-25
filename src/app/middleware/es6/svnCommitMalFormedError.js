import CsError from './csError';

class SvnCommitMalformedError extends CsError {
	constructor(error, pushEvent) {
		super(['There was an unexpected error when processing your Svn commit event.']);
		this.originalError = error;
		this.pushEvent = pushEvent;
	}
}

export default SvnCommitMalformedError;