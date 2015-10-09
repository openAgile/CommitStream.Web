import ExtendableError from 'es6-error';
import _ from 'underscore';

const UNEXPECTED_ERROR_MSG = 'There was an unexpected error when processing your request.';

class CSError extends ExtendableError {
  constructor(errors = [], statusCode = 400, internalMessage = null) {
    super();
    this.errors = {
      errors
    };
    this.statusCode = statusCode;
    this.internalMessage = internalMessage;
    if (this.internalMessage !== null) {
      this.errors = {
        errors: [UNEXPECTED_ERROR_MSG]
      };
    }
  }

  static create(status = 400, errors) {
    let _errors = [];

    if (_.isArray(errors)) {
      _errors = errors;
    } else if (_.isString(errors)) {
      _errors.push(errors);
    } else {
      _errors.push(UNEXPECTED_ERROR_MSG)
    }
    return new CSError(_errors, status);
  }
}

export default CSError;
