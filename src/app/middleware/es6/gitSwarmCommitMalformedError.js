import CsError from './csError';

class GitSwarmCommitMalformedError extends CsError {
	constructor(error, pushEvent) {
		super(['There was an unexpected error when processing your GitSwarm push event.']);
		this.originalError = error;
		this.pushEvent = pushEvent;
	}
}

export default GitSwarmCommitMalformedError;