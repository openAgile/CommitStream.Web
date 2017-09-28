import CSError from './csError';

class CtfGitCommitMalformedError extends CSError {
  constructor(error, pushEvent) {
    super(['There was an unexpected error when processing your CollabNet TeamForge Git commit event.']);
    this.originalError = error;
    this.pushEvent = pushEvent;
  }
}

export default CtfGitCommitMalformedError;