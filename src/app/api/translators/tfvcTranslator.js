'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _uuidV4 = require('uuid-v4');

var _uuidV42 = _interopRequireDefault(_uuidV4);

var _helpersVcsFamilies = require('../helpers/vcsFamilies');

var _helpersVcsFamilies2 = _interopRequireDefault(_helpersVcsFamilies);

var _middlewareTfvcCommitMalformedError = require('../../middleware/tfvcCommitMalformedError');

var _middlewareTfvcCommitMalformedError2 = _interopRequireDefault(_middlewareTfvcCommitMalformedError);

var tfvcTranslator = {
    family: _helpersVcsFamilies2['default'].Tfvc,
    translatePush: function translatePush(event, instanceId, digestId, inboxId) {
        try {
            var repository = {
                url: event.resourceContainers.collection.baseUrl + event.resource.teamProjectIds[0] + "/_versionControl/"
            };

            var commit = {
                sha: event.id,
                commit: {
                    author: {
                        name: event.resource.author.displayName,
                        email: event.resource.author.uniqueName
                    },
                    committer: {
                        name: event.resource.checkedInBy.displayName,
                        email: event.resource.checkedInBy.uniqueName,
                        date: ''
                    },
                    message: event.message.text
                },
                html_url: event.resourceContainers.collection.baseUrl + event.resource.teamProjectIds[0] + "/_versionControl/changeset/" + event.resource.changesetId,
                repository: repository,
                branch: '',
                originalMessage: event
            };

            return [{
                eventId: (0, _uuidV42['default'])(),
                eventType: tfvcTranslator.family + 'CommitReceived',
                data: commit,
                metadata: {
                    instanceId: instanceId,
                    digestId: digestId,
                    inboxId: inboxId
                }
            }];
        } catch (ex) {
            throw new _middlewareTfvcCommitMalformedError2['default'](ex, event);
        }
    }
};

exports['default'] = tfvcTranslator;
module.exports = exports['default'];
