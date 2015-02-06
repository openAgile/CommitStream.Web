(function(schemaValidator) {
	var _ = require('underscore'),
		jsonschema = new (require('jsonschema').Validator);

	schemaValidator.validate = function(typeName, data, schema) {
		var result = jsonschema.validate(data, schema, {propertyName: typeName});

		var errors = _.map(result.errors, function(error) {
			console.log(error);
			return error.property + ' ' + error.message;
		});

		return errors;
	};
})(module.exports);