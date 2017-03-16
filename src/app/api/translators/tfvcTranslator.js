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

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var tfvcTranslator = {
    canTranslate: function canTranslate(request) {
        return _underscore2['default'].isString(request.body.eventType) && request.body.eventType === 'tfvc.checkin' && _underscore2['default'].isString(request.body.publisherId) && request.body.publisherId === 'tfs';
    },
    family: _helpersVcsFamilies2['default'].Tfvc,
    translatePush: function translatePush(event, instanceId, digestId, inboxId) {
        try {
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
                html_url: getHTMLUrlsPerProject(event),
                repository: getRepositoryUrlsPerProject(event),
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
    },
    getProperties: function getProperties(commitEvent) {
        var props = {
            repo: '',
            repoHref: commitEvent.repository,
            branchHref: ''
        };
        return props;
    }
};

var getHTMLUrlsPerProject = function getHTMLUrlsPerProject(event) {
    var htmlUrlsPerProject = [];

    event.resource.teamProjectIds.forEach(function (projectId) {
        htmlUrlsPerProject.push(event.resourceContainers.collection.baseUrl + projectId + "/_versionControl/changeset/" + event.resource.changesetId);
    });

    return htmlUrlsPerProject;
};

var getRepositoryUrlsPerProject = function getRepositoryUrlsPerProject(event) {
    var repositoryUrlsPerProject = [];

    event.resource.teamProjectIds.forEach(function (projectId) {
        repositoryUrlsPerProject.push(event.resourceContainers.collection.baseUrl + projectId + "/_versionControl/");
    });

    var repositoryUrls = {
        url: repositoryUrlsPerProject
    };

    return repositoryUrls;
};

exports['default'] = tfvcTranslator;
module.exports = exports['default'];
