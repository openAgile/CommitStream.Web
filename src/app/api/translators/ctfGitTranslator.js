'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _uuidV4 = require('uuid-v4');

var _uuidV42 = _interopRequireDefault(_uuidV4);

var _middlewareCtfGitCommitMalformedError = require('../../middleware/ctfGitCommitMalformedError');

var _middlewareCtfGitCommitMalformedError2 = _interopRequireDefault(_middlewareCtfGitCommitMalformedError);

var _branchNameParse = require('./branchNameParse');

var _branchNameParse2 = _interopRequireDefault(_branchNameParse);

var _helpersVcsFamilies = require('../helpers/vcsFamilies');

var _helpersVcsFamilies2 = _interopRequireDefault(_helpersVcsFamilies);

var ctfGitTranslator = {
    family: _helpersVcsFamilies2['default'].CtfGit,
    canTranslate: function canTranslate(request) {
        if (hasCorrectHeaders(request.headers) && request.body.hasOwnProperty('event_type')
        // remove this once this translator can process other event types by TeamForge Git
         && request.body.event_type === 'ref-updated') {
            return true;
        }
        return false;
    },
    translatePush: function translatePush(ctfEvent, instanceId, digestId, inboxId) {
        try {
            var _ret = (function () {
                var branch = (0, _branchNameParse2['default'])(ctfEvent.ref);
                var repository = {
                    id: ctfEvent.repository.id,
                    name: ctfEvent.repository.name,
                    url: ctfEvent.repository.url
                };
                return {
                    v: ctfEvent.commits.map(function (aCommit) {
                        var commit = {
                            sha: aCommit.id,
                            commit: {
                                author: {
                                    name: aCommit.author.name,
                                    email: aCommit.author.email
                                },
                                committer: {
                                    name: aCommit.committer.name,
                                    email: aCommit.committer.email,
                                    date: aCommit.timestamp
                                },
                                message: aCommit.message
                            },
                            html_url: aCommit.url,
                            repository: repository,
                            branch: branch,
                            originalMessage: aCommit
                        };
                        return {
                            eventId: (0, _uuidV42['default'])(),
                            eventType: ctfGitTranslator.family + 'CommitReceived',
                            data: commit,
                            metadata: {
                                instanceId: instanceId,
                                digestId: digestId,
                                inboxId: inboxId
                            }
                        };
                    })
                };
            })();

            if (typeof _ret === 'object') return _ret.v;
        } catch (ex) {
            throw new _middlewareCtfGitCommitMalformedError2['default'](ex, ctfEvent);
        }
    },
    getProperties: function getProperties(event) {
        var props = {
            repo: event.repository.name,
            repoHref: event.repository.url,
            branchHref: event.branch
        };
        // TODO update this when payload has the branchUrl or a template for it
        if (props.repoHref && event.branch) {
            var repoBaseUrl = null;
            var suffix = '/tree';
            var endsWithSuffix = props.repoHref.indexOf(suffix, props.repoHref.length - suffix.length) !== -1;
            if (endsWithSuffix) {
                repoBaseUrl = props.repoHref;
            } else if (props.repoHref.indexOf('/tree?treeId=') > 0) {
                repoBaseUrl = url.split("?")[0];
            }
            if (repoBaseUrl) {
                props.branchHref = repoBaseUrl + '?treeId=' + encodeURIComponent('refs/heads/' + event.branch);
            }
        }
        return props;
    }
};

var hasCorrectHeaders = function hasCorrectHeaders(headers) {
    return headers.hasOwnProperty('x-ctf-scm') && headers['x-ctf-scm'] === 'git';
};

exports['default'] = ctfGitTranslator;
module.exports = exports['default'];
