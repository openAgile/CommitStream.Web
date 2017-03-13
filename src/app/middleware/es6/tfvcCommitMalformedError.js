import CSError from './csError';

class tfvcCommitMalformedError extends CSError {
    constructor(error, pushEvent) {
        super(['There was an unexpected error when processing your TFVC push event.']);
        this.originalError = error;
        this.pushEvent = pushEvent;
    }
}

export default tfvcCommitMalformedError;