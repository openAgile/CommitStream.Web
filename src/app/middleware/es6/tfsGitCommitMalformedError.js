import CSError from './csError';

class tfsGitCommitMalformedError extends CSError {
    constructor(error, pushEvent) {
        super(['There was an unexpected error when processing your tfsGit push event.']);
        this.originalError = error;
        this.pushEvent = pushEvent;
    }
}

export default tfsGitCommitMalformedError;