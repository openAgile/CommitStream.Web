import sanitizeHtml from 'sanitize-html';

export default {
  sanitize(typeName, obj, fields) {
    const errors = [];

    for(const field of fields) {
      if (obj.hasOwnProperty(field)) {
        const originalValue = obj[field];
        const sanitizedValue = sanitizeHtml(obj[field], {allowedTags: []});
        obj[field] = sanitizedValue;
        if (originalValue !== sanitizedValue) {
          errors.push(`${typeName}.${field} cannot contain script tags or HTML.`);
        }
      }
    }

    return errors;
  }
};