'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var isTfsRequest = function isTfsRequest(request) {
    return _underscore2['default'].isString(request.body.eventType) && request.body.eventType === 'git.push' && _underscore2['default'].isString(request.body.publisherId) && request.body.publisherId === 'tfs';
};

var butIsMissingCommits = function butIsMissingCommits(request) {
    return _underscore2['default'].isObject(request.body.resource) && !_underscore2['default'].isArray(request.body.resource.commits);
};

var tfsGitResponder = {
    canRespond: function canRespond(request) {
        return isTfsRequest(request) && butIsMissingCommits(request);
    },
    respond: function respond(res) {
        // return res.status(202).send({responderMessage : 'We only translate messages with commits', status : '202'});
        return res.status(202);
    }
};

exports['default'] = tfsGitResponder;
module.exports = exports['default'];
