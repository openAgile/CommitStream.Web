import validator from 'validator';
import CSError from '../middleware/csError';

class UUIDError extends CSError {}

// TODO: This may need some unit tests around it, not highly important right now.
export default function(valueType, data) {
  const errors = [`The value ${data} is not a valid identifier for ${valueType}`];
  if (!validator.isUUID(data)) {
    throw new UUIDError(errors);
  }
};