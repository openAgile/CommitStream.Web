import CsError from './csError';

class GitLabCommitMalformedError extends CsError {
	constructor(error, pushEvent) {
		super(['There was an unexpected error when processing your GitLab push event.']);
		this.originalError = error;
		this.pushEvent = pushEvent;
	}
}

export default GitLabCommitMalformedError;