import _ from 'underscore';

const isTfsRequest = request =>
    (_.isString(request.body.eventType) && request.body.eventType === 'git.push')
    && 
    (_.isString(request.body.publisherId) && request.body.publisherId === 'tfs');

const butIsMissingCommits = request =>
    _.isObject(request.body.resource) && !_.isArray(request.body.resource.commits);

const tfsGitResponder = {
    canRespond(request) { return isTfsRequest(request) && butIsMissingCommits(request); },
    respond(res) {
       // return res.status(202).send({responderMessage : 'We only translate messages with commits', status : '202'});
       return res.status(202);
      }
}


export default tfsGitResponder;