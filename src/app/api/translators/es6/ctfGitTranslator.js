import uuid from 'uuid-v4';
import CtfGitCommitMalformedError from '../../middleware/ctfGitCommitMalformedError';
import branchNameParse from './branchNameParse';
import VcsFamilies from '../helpers/vcsFamilies';

const ctfGitTranslator = {
        family: VcsFamilies.CtfGit,
        canTranslate(request) {
            if (hasCorrectHeaders(request.headers)
                    && request.body.hasOwnProperty('event_type')
                    // remove this once this translator can process other event types by TeamForge Git
                    && request.body.event_type === 'ref-updated') {
                return true;
            }
            return false;
        },
        translatePush: function translatePush(ctfEvent, instanceId, digestId, inboxId) {
            try {
                const branch = branchNameParse(ctfEvent.ref);
                const repository = {
                        id: ctfEvent.repository.id,
                        name: ctfEvent.repository.name,
                        url: ctfEvent.repository.url
                };
                return ctfEvent.commits.map(aCommit => {
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
                            repository,
                            branch,
                            originalMessage: aCommit
                    };
                    return {
                        eventId: uuid(),
                        eventType: ctfGitTranslator.family + 'CommitReceived',
                        data: commit,
                        metadata: {
                            instanceId,
                            digestId,
                            inboxId
                        }
                    };
                });
            } catch (ex) {
                throw new CtfGitCommitMalformedError(ex, ctfEvent);
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
                }
                else if (props.repoHref.indexOf('/tree?treeId=') > 0) {
                    repoBaseUrl = url.split("?")[0];
                }
                if (repoBaseUrl) {
                    props.branchHref = repoBaseUrl + '?treeId=' + encodeURIComponent('refs/heads/' + event.branch);
                }
            }
            return props;
        }
};

const hasCorrectHeaders = (headers) => headers.hasOwnProperty('x-ctf-scm')
&& headers['x-ctf-scm'] === 'git';

export default ctfGitTranslator;