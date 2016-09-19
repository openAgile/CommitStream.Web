import CSError from './csError';

class VsoGitCommitMalformedError extends CSError {
    constructor(error, pushEvent) {
        super(['There was an unexpected error when processing your Visual Studio Online Git push event.']);
        this.originalError = error;
        this.pushEvent = pushEvent;
    }
}

export default VsoGitCommitMalformedError;