'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _uuidV4 = require('uuid-v4');

var _uuidV42 = _interopRequireDefault(_uuidV4);

var _helpersVcsFamilies = require('../helpers/vcsFamilies');

var _helpersVcsFamilies2 = _interopRequireDefault(_helpersVcsFamilies);

var _schemaValidator = require('../schemaValidator');

var _schemaValidator2 = _interopRequireDefault(_schemaValidator);

(function (inboxAdded) {

    inboxAdded.create = function (instanceId, digestId, family, name, url) {
        var eventId = (0, _uuidV42['default'])();
        var inboxId = (0, _uuidV42['default'])();
        return {
            eventType: 'InboxAdded',
            eventId: eventId,
            data: {
                instanceId: instanceId,
                digestId: digestId,
                inboxId: inboxId,
                family: family,
                name: name,
                url: url
            }
        };
    };

    inboxAdded.SCHEMA = {
        title: 'inbox',
        type: 'object',
        required: ['digestId', 'family', 'name'],
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
                'enum': ['Deveo', 'GitHub', 'GitLab', 'Bitbucket', 'VsoGit', _helpersVcsFamilies2['default'].Svn, _helpersVcsFamilies2['default'].GitSwarm, _helpersVcsFamilies2['default'].P4V]
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

    inboxAdded.validate = function (data) {
        return _schemaValidator2['default'].validate('inbox', data, inboxAdded.SCHEMA);
    };
})(module.exports);
