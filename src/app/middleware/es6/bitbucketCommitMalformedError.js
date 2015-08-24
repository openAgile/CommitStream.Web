import csError from './csError';

let BitbucketCommitMalformedError = csError.createCustomError('BitbucketCommitMalformedError', (error, pushEvent) => {
  let message = 'There was an unexpected error when processing your Bitbucket push event.';
  let errors = [message];
  BitbucketCommitMalformedError.prototype.constructor.call(this, errors, 400);
});

export default BitbucketCommitMalformedError;
