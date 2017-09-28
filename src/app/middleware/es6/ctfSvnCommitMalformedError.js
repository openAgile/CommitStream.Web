import CSError from './csError';

class CtfSvnCommitMalformedError extends CSError {
  constructor(error, pushEvent) {
    super(['There was an unexpected error when processing your CollabNet TeamForge Subversion commit event.']);
    this.originalError = error;
    this.pushEvent = pushEvent;
  }
}

export default CtfSvnCommitMalformedError;