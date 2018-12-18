import _ from 'underscore';

const isTfsRequest = request =>
    (_.isString(request.body.eventType) && request.body.eventType === 'git.push')
    && 
    (_.isString(request.body.publisherId) && request.body.publisherId === 'tfs');

const butIsMissingCommits = request =>
    request.body.resource === null
    ||
    (_.isObject(request.body.resource) && !_.isArray(request.body.resource.commits));

const tfsGitResponder = {
    canRespond(request) { return isTfsRequest(request) && butIsMissingCommits(request); }
}

export default tfsGitResponder;