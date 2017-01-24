import uuid from 'uuid-v4';
import schemaValidator from '../schemaValidator';

const SCHEMA = {
   "title": "instance",
   "type": "object",
   "required": [
       "instanceId"
   ],
   "properties": {
       "instanceId": {
           "title": "ID of the instance",
           "type": "string",
           "minLength": 36,
           "maxLength": 36
       },
       "apiKey": {
           "title": "API Key for this instance",
           "type": "string",
           "minLength": 36,
           "maxLength": 36
       }
   }
};

export default {
   create() {
       const eventId = uuid();
       const instanceId = uuid();
       const apiKey = uuid();
       const instanceAddedEvent = {
           eventType: 'InstanceAdded',
           eventId,
           data: {
               instanceId,
               apiKey,
           }
       };

       return instanceAddedEvent;
   },
   validate(data) {
       return schemaValidator.validate('instance', data, SCHEMA);
   }
};