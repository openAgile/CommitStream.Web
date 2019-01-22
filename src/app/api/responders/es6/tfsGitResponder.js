import _ from 'underscore';

const isTfsRequest = request =>
    (_.isString(request.body.eventType) && request.body.eventType === 'git.push')
    && 
    (_.isString(request.body.publisherId) && request.body.publisherId === 'tfs');

const butIsMissingCommits = request =>
    _.isObject(request.body.resource) && !_.isArray(request.body.resource.commits);

const tfsGitResponder = {
    canRespond(request) { 
        return isTfsRequest(request) && butIsMissingCommits(request);
        },

    respond(res) {
        return new Promise((resolve, reject) => {
            res.status(202).send('The CommitStream accepted your push but no action will be taken since it is likely a push after a merge ')
            .done(() => {
                resolve(res);
            })
            .fail(() => {
                reject(null);
            });
        });
    }
}


export default tfsGitResponder;