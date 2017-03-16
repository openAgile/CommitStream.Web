import uuid from 'uuid-v4';
import VcsFamilies from '../helpers/vcsFamilies';
import tfvcCommitMalformedError from'../../middleware/tfvcCommitMalformedError';
import _ from 'underscore';

let tfvcTranslator = {
    canTranslate(request) {
      return (_.isString(request.body.eventType) && request.body.eventType === 'tfvc.checkin')
        && (_.isString(request.body.publisherId) && request.body.publisherId === 'tfs');
    },
    family: VcsFamilies.Tfvc,
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
                eventType: tfvcTranslator.family + 'CommitReceived',
                data: commit,
                metadata: {
                    instanceId,
                    digestId,
                    inboxId
                }
            }];
        } catch (ex) {
            throw new tfvcCommitMalformedError(ex, event);
        }
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

export default tfvcTranslator;