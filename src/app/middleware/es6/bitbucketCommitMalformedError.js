import CSError from './csError';

class BitbucketCommitMalformedError extends CSError {
	constructor(error, pushEvent) {
		super(['There was an unexpected error when processing your Bitbucket push event.']);
		this.originalError = error;
		this.pushEvent = pushEvent;
	}
}

export default BitbucketCommitMalformedError;
