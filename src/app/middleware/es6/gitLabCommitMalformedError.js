import CsError from './csError';

class GitLabCommitMalformedError extends CsError {
	constructor() {
		super(['There was an unexpected error when processing your GitLab push event.']);
	}
}

export default GitLabCommitMalformedError;