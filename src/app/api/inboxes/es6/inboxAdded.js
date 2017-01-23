import uuid from 'uuid-v4';
import vcsFamilies from '../helpers/vcsFamilies';
import schemaValidator from '../schemaValidator';

(((inboxAdded) => {

    inboxAdded.create = (instanceId, digestId, family, name, url) => {
        const eventId = uuid();
        const inboxId = uuid();
        return {
            eventType: 'InboxAdded',
            eventId,
            data: {
                instanceId,
                digestId,
                inboxId,
                family,
                name,
                url
            }
        };
    };

    inboxAdded.SCHEMA = {
        title: 'inbox',
        type: 'object',
        required: [
            'digestId',
            'family',
            'name'
        ],
        properties: {
            instanceId: {
                title: 'ID of the instance to which this inbox will belong',
                type: 'string',
                minLength: 36,
                maxLength: 36
            },
            digestId: {
                title: 'ID of the digest to which this inbox will belong',
                type: 'string',
                minLength: 36,
                maxLength: 36
            },
            family: {
                title: 'Version Control System type',
                type: 'string',
                enum: [
                    'Deveo',
                    'GitHub',
                    'GitLab',
                    'Bitbucket',
                    'VsoGit',
                    vcsFamilies.Svn,
                    vcsFamilies.GitSwarm,
                    vcsFamilies.P4V
                ]
            },
            name: {
                type: 'string',
                title: 'Short name for this inbox',
                minLength: 1,
                maxLength: 140
            },
            url: {
                type: 'string',
                title: 'URL of the repository',
                maxLength: 2000,
                minLength: 3
            }
        }
    };

    inboxAdded.validate = (data) => {
        return schemaValidator.validate('inbox', data, inboxAdded.SCHEMA);
    };

})(module.exports));
