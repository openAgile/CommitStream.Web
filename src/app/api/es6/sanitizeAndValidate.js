import { sanitize } from './sanitizer';
import CSError from '../middleware/csError';

class SanitizationError extends CSError {
  constructor(errors) {
    super(errors);
  }
}

class SchemaValidationError extends CSError {
  constructor(errors) {
    super(errors);
  }
}

export default function(objType, data, fieldsToSanitize, schema) {
  let errors = sanitize(objType, data, fieldsToSanitize);
  if (errors.length > 0) {
    throw  new SanitizationError(errors);
  }

  errors = schema.validate(data);
  if (errors.length > 0) {
    throw new SchemaValidationError(errors);    
  }
};