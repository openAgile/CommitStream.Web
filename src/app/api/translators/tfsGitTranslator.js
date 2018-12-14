'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _uuidV4 = require('uuid-v4');

var _uuidV42 = _interopRequireDefault(_uuidV4);

var _helpersVcsFamilies = require('../helpers/vcsFamilies');

var _helpersVcsFamilies2 = _interopRequireDefault(_helpersVcsFamilies);

//import VsoTfvcCommitMalformedError from'../../middleware/vsoTfvcCommitMalformedError';

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var tfsGitTranslator = {
    family: _helpersVcsFamilies2['default'].TfsGit,
    canTranslate: function canTranslate(request) {
        return _underscore2['default'].isString(request.body.eventType) && request.body.eventType === 'git.push' && _underscore2['default'].isString(request.body.publisherId) && request.body.publisherId === 'tfs' && request.body.resource.commits == undefined;
    },
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
                        date: event.resource.createdDate
                    },
                    message: event.detailedMessage.text
                },
                html_url: getHTMLUrlsPerProject(event),
                repository: getRepositoryUrlsPerProject(event),
                branch: '',
                originalMessage: event
            };

            return [{
                eventId: (0, _uuidV42['default'])(),
                eventType: vsoTfvcTranslator.family + 'CommitReceived',
                data: commit,
                metadata: {
                    instanceId: instanceId,
                    digestId: digestId,
                    inboxId: inboxId
                }
            }];
        } catch (ex) {
            throw new VsoTfvcCommitMalformedError(ex, event);
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
    var baseUrl = event.resourceContainers.collection.baseUrl;
    var regex = /(https?:\/\/\S+\/tfs\/\S+)(\/_apis\/tfvc\/changesets)/g;
    var match = regex.exec(event.resource.url);

    if (match != null) {
        baseUrl = match[1] + '/';
    }
    event.resource.teamProjectIds.forEach(function (projectId) {
        htmlUrlsPerProject.push(baseUrl + projectId + "/_versionControl/changeset/" + event.resource.changesetId);
    });

    return htmlUrlsPerProject;
};

var getRepositoryUrlsPerProject = function getRepositoryUrlsPerProject(event) {
    var repositoryUrlsPerProject = [];
    var baseUrl = event.resourceContainers.collection.baseUrl;
    var regex = /(https?:\/\/\S+\/tfs\/\S+)(\/_apis\/tfvc\/changesets)/g;
    var match = regex.exec(event.resource.url);

    if (match != null) {
        baseUrl = match[1] + '/';
    }

    event.resource.teamProjectIds.forEach(function (projectId) {
        repositoryUrlsPerProject.push(baseUrl + projectId + "/_versionControl/");
    });

    var repositoryUrls = {
        url: repositoryUrlsPerProject
    };

    return repositoryUrls;
};

exports['default'] = tfsGitTranslator;
module.exports = exports['default'];
