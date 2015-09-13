import CSError from './csError';

class UnsupportedMediaType extends CSError {
  constructor(message = 'The Content-Type header is unspecified or invalid') {
    const errors = [message];
    super(errors, 415);
  }
}

export default function(req, res, next) {    
  if (req.method !== 'POST') return next();
  if (!req.is('application/json')) {
    throw new UnsupportedMediaType('When issuing a POST to the CommitStream API, you must send a Content-Type: application/json header.');
  } else {
    return next();
  }
};