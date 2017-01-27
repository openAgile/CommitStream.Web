import jsonschema from 'jsonschema';

const validator = new jsonschema.Validator;

export default {
  validate(typeName, data, schema) {
    const result = validator.validate(data, schema, {propertyName: typeName});
    const errors = result.errors.map(error => {
      console.log(error);
      return `${error.property} ${error.message}`;
    });
    return errors;
  }
};