import CSError from './csError';

class GitHubCommitMalformedError extends CSError {
    constructor(error, pushEvent) {
        super(['There was an unexpected error when processing your GitHub push event.']);
        this.originalError = error;
        this.pushEvent = pushEvent;
    }
}

export default GitHubCommitMalformedError;