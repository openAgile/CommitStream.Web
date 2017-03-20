import uuid from 'uuid-v4';
import VcsFamilies from '../helpers/vcsFamilies';
import VsoTfvcCommitMalformedError from'../../middleware/vsoTfvcCommitMalformedError';
import _ from 'underscore';

let vsoTfvcTranslator = {
    canTranslate(request) {
      return (_.isString(request.body.eventType) && request.body.eventType === 'vsoTfvc.checkin')
        && (_.isString(request.body.publisherId) && request.body.publisherId === 'tfs');
    },
    family: VcsFamilies.VsoTfvc,
    translatePush(event, instanceId, digestId, inboxId) {
        try {
            const commit = {
                sha: event.id,
                commit: {
                    author:{
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
                branch:'',
                originalMessage: event
            }

            return [{
                eventId: uuid(),
                eventType: vsoTfvcTranslator.family + 'CommitReceived',
                data: commit,
                metadata: {
                    instanceId,
                    digestId,
                    inboxId
                }
            }];
        } catch (ex) {
            throw new VsoTfvcCommitMalformedError(ex, event);
        }
    },
    getProperties(commitEvent) {
        const props = {
            repo: '',
            repoHref: commitEvent.repository,
            branchHref: ''
        };
        return props;
    }
}

const getHTMLUrlsPerProject = (event) => {
    let htmlUrlsPerProject = [];

    event.resource.teamProjectIds.forEach((projectId) => {
        htmlUrlsPerProject.push(event.resourceContainers.collection.baseUrl +  projectId + "/_versionControl/changeset/" + event.resource.changesetId)
    })

    return htmlUrlsPerProject;
}

const getRepositoryUrlsPerProject = (event) => {
    let repositoryUrlsPerProject = [];

    event.resource.teamProjectIds.forEach((projectId) => {
        repositoryUrlsPerProject.push(event.resourceContainers.collection.baseUrl + projectId + "/_versionControl/")
    });

    const repositoryUrls = {
        url: repositoryUrlsPerProject
    }

    return repositoryUrls;
}

export default vsoTfvcTranslator;