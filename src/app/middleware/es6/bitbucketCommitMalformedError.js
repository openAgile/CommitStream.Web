import CSError from './csError';

class BitbucketCommitMalformedError extends CSError {
	constructor(error, pushEvent) {
		const message = 'There was an unexpected error when processing your Bitbucket push event.';
		const errors = [message];
		super(errors);
	}
}

export default BitbucketCommitMalformedError;
