import uuid from 'uuid-v4';
import VcsFamilies from '../helpers/vcsFamilies';
import VsoTfvcCommitMalformedError from'../../middleware/vsoTfvcCommitMalformedError';
import _ from 'underscore';

const vsoTfvcTranslator = {
    family: VcsFamilies.VsoTfvc,
    canTranslate(request) {
      return (_.isString(request.body.eventType) && request.body.eventType === 'tfvc.checkin')
        && (_.isString(request.body.publisherId) && request.body.publisherId === 'tfs');
    },
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
                        date: event.resource.createdDate
                    },
                    message: event.detailedMessage.text
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
    let baseUrl = event.resourceContainers.collection.baseUrl;
    //const regex = /(https?:\/\/)(\w+\/)(\w+)\/(_apis\/tfvc)/g;
    const regex = /(https?:\/\/\S+\/tfs)(\/\S+\/)(_apis\/tfvc\/changesets)/g;
    let match = regex.exec(event.resource.url)
    console.log('match='+match)

    if (match != null)
    {
       baseUrl = match[1] + '/';
    }
    event.resource.teamProjectIds.forEach((projectId) => {
        htmlUrlsPerProject.push(baseUrl + projectId + "/_versionControl/changeset/" + event.resource.changesetId);
    })

    return htmlUrlsPerProject;
}

const getRepositoryUrlsPerProject = (event) => {
    let repositoryUrlsPerProject = [];
    let baseUrl = event.resourceContainers.collection.baseUrl;
    const regex = /(https?:\/\/)(\w+\/)(\w+)\/(_apis\/tfvc)/g;
    let match = regex.exec(event.resource.url)

    if (match != null)
    {
        baseUrl = match[0] + match[1];
    }

    event.resource.teamProjectIds.forEach((projectId) => {
        repositoryUrlsPerProject.push(baseUrl + projectId + "/_versionControl/")
    });

    const repositoryUrls = {
        url: repositoryUrlsPerProject
    }

    return repositoryUrls;
}

export default vsoTfvcTranslator;