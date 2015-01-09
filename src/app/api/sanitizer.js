(function(sanitizer) {
	var sanitizeHtml = require('sanitize-html');

	sanitizer.sanitize = function(typeName, obj, fields) {
		var errors = [];
		
		fields.forEach(function(field) {
			if (obj.hasOwnProperty(field)) {
				var originalValue = obj[field];
				var sanitizedValue = sanitizeHtml(obj[field], {allowedTags: []});
				obj[field] = sanitizedValue;
				if (originalValue !== sanitizedValue) {
					errors.push(typeName + '.' + field + ' cannot contain script tags or HTML.');
				}
			}
		});
		
		return errors;
	};

})(module.exports);