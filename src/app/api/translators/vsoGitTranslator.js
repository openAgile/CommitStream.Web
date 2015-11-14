'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _uuidV4 = require('uuid-v4');

var _uuidV42 = _interopRequireDefault(_uuidV4);

var _middlewareCsError = require('../../middleware/csError');

var _middlewareCsError2 = _interopRequireDefault(_middlewareCsError);

var VsoGitCommitMalformedError = (function (_CSError) {
  _inherits(VsoGitCommitMalformedError, _CSError);

  function VsoGitCommitMalformedError(error, pushEvent) {
    _classCallCheck(this, VsoGitCommitMalformedError);

    _get(Object.getPrototypeOf(VsoGitCommitMalformedError.prototype), 'constructor', this).call(this, ['There was an unexpected error when processing your Visual Studio Online Git push event.']);
    this.originalError = error;
    this.pushEvent = pushEvent;
  }

  return VsoGitCommitMalformedError;
})(_middlewareCsError2['default']);

var vsoGitTranslator = {
  family: 'VsoGit',
  canTranslate: function canTranslate(request) {
    return request.body.eventType && request.body.eventType === 'git.push' && (request.body.publisherId && request.body.publisherId === 'tfs');
  },
  translatePush: function translatePush(pushEvent, instanceId, digestId, inboxId) {
    try {
      var _ret = (function () {
        var branchParts = pushEvent.resource.refUpdates[0].name.split('/');
        // knock off the prefixing stuff
        branchParts.shift();
        branchParts.shift();
        var branch = undefined;
        if (branchParts.length > 1) branch = branchParts.join('/');else branch = branchParts[0];
        var repository = {
          id: pushEvent.resource.repository.id,
          name: pushEvent.resource.repository.name
        };

        var getHtmlCommitUrl = function getHtmlCommitUrl(theCommit) {
          var repositoryName = encodeURIComponent(pushEvent.resource.repository.name);
          // Original format: https://v1platformtest.visualstudio.com/DefaultCollection/_apis/git/repositories/d29767bb-8f5f-4c43-872f-6c73635a1256/commits/e771d9b9d5abab2da4107a0e6db05cef21e40ce8
          // Expected format: https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/commit/e771d9b9d5abab2da4107a0e6db05cef21e40ce8
          var url = theCommit.url.replace(/_apis\/git\/repositories\/.*?\/commits\//i, '_git/' + repositoryName + '/commit/');
          return url;
        };

        var events = pushEvent.resource.commits.map(function (aCommit) {
          var commit = {
            sha: aCommit.commitId,
            commit: {
              author: {
                name: aCommit.author.name,
                email: aCommit.author.email
              },
              committer: {
                name: aCommit.committer.name,
                email: aCommit.committer.email,
                date: aCommit.committer.date
              },
              message: aCommit.comment
            },
            html_url: getHtmlCommitUrl(aCommit),
            repository: repository,
            branch: branch,
            originalMessage: aCommit
          };
          return {
            eventId: (0, _uuidV42['default'])(),
            eventType: 'VsoGitCommitReceived',
            data: commit,
            metadata: {
              instanceId: instanceId,
              digestId: digestId,
              inboxId: inboxId
            }
          };
        });
        return {
          v: events
        };
      })();

      if (typeof _ret === 'object') return _ret.v;
    } catch (ex) {
      var malformedEx = new VsoGitCommitMalformedError(ex, pushEvent);
      throw malformedEx;
    }
  },
  getProperties: function getProperties(event) {
    var commit = event.commit;
    var branch = event.branch;
    var html_url = event.html_url;
    var props = {
      repoName: '',
      branchHref: '',
      repoHref: ''
    };

    var urlComponents = html_url.match(/http.?:\/\/(.*?)\..*?_git\/(.*?)\/commit/);
    var serverUrlMatch = html_url.match(/(http.?:)\/\/(.*?_git)\//);
    if (urlComponents !== null && serverUrlMatch !== null) {
      props.repoName = urlComponents[2];
      var repoOwner = urlComponents[1];
      var protocol = serverUrlMatch[1];
      var serverUrl = protocol + '//' + serverUrlMatch[2];
      props.repoHref = serverUrl + '/' + props.repoName;
      props.branchHref = props.repoHref + '/#version=GB' + encodeURIComponent(branch);
    } else {
      // TODO: use proper error here
      throw 'Could not parse VsoGitCommitReceived event props correctly.';
    }

    return props;
  }
};

exports['default'] = vsoGitTranslator;

/*
{
  "subscriptionId": "a36104aa-ef6c-4643-ac08-5c42fd2115d3",
  "notificationId": 5,
  "id": "37acb941-1f37-40df-9b83-62f51d0c0e22",
  "eventType": "git.push",
  "publisherId": "tfs",
  "message": {
    "text": "Josh Gough pushed updates to branch master of V1 Integration\r\n(https:\/\/v1platformtest.visualstudio.com\/DefaultCollection\/_git\/V1%20Integration\/#version=GBmaster)",
    "html": "Josh Gough pushed updates to branch <a href=\"https:\/\/v1platformtest.visualstudio.com\/DefaultCollection\/_git\/V1%20Integration\/#version=GBmaster\">master<\/a> of <a href=\"https:\/\/v1platformtest.visualstudio.com\/DefaultCollection\/_git\/V1 Integration\/\">V1 Integration<\/a>",
    "markdown": "Josh Gough pushed updates to branch [master](https:\/\/v1platformtest.visualstudio.com\/DefaultCollection\/_git\/V1%20Integration\/#version=GBmaster) of [V1 Integration](https:\/\/v1platformtest.visualstudio.com\/DefaultCollection\/_git\/V1 Integration\/)"
  },
  "detailedMessage": {
    "text": "Josh Gough pushed 1 commit to branch master of V1 Integration\r\n - Updated README.md a0e1a2ee (https:\/\/v1platformtest.visualstudio.com\/DefaultCollection\/_git\/V1%20Integration\/commit\/a0e1a2eea895c7615725462dedeea0067797a8fe)",
    "html": "Josh Gough pushed 1 commit to branch <a href=\"https:\/\/v1platformtest.visualstudio.com\/DefaultCollection\/_git\/V1%20Integration\/#version=GBmaster\">master<\/a> of <a href=\"https:\/\/v1platformtest.visualstudio.com\/DefaultCollection\/_git\/V1 Integration\/\">V1 Integration<\/a>\r\n<ul>\r\n<li>Updated README.md <a href=\"https:\/\/v1platformtest.visualstudio.com\/DefaultCollection\/_git\/V1%20Integration\/commit\/a0e1a2eea895c7615725462dedeea0067797a8fe\">a0e1a2ee<\/a><\/li>\r\n<\/ul>",
    "markdown": "Josh Gough pushed 1 commit to branch [master](https:\/\/v1platformtest.visualstudio.com\/DefaultCollection\/_git\/V1%20Integration\/#version=GBmaster) of [V1 Integration](https:\/\/v1platformtest.visualstudio.com\/DefaultCollection\/_git\/V1 Integration\/)\r\n* Updated README.md [a0e1a2ee](https:\/\/v1platformtest.visualstudio.com\/DefaultCollection\/_git\/V1%20Integration\/commit\/a0e1a2eea895c7615725462dedeea0067797a8fe)"
  },
  "resource": {
    "commits": [
      {
        "commitId": "a0e1a2eea895c7615725462dedeea0067797a8fe",
        "author": {
          "name": "Josh Gough",
          "email": "jsgough@gmail.com",
          "date": "2015-11-11T18:24:39Z"
        },
        "committer": {
          "name": "Josh Gough",
          "email": "jsgough@gmail.com",
          "date": "2015-11-11T18:24:39Z"
        },
        "comment": "Updated README.md",
        "url": "https:\/\/v1platformtest.visualstudio.com\/DefaultCollection\/_apis\/git\/repositories\/d29767bb-8f5f-4c43-872f-6c73635a1256\/commits\/a0e1a2eea895c7615725462dedeea0067797a8fe"
      }
    ],
    "refUpdates": [
      {
        "name": "refs\/heads\/master",
        "oldObjectId": "a1efb60c62e54f7a8f8caea87f394d7debfdc727",
        "newObjectId": "a0e1a2eea895c7615725462dedeea0067797a8fe"
      }
    ],
    "repository": {
      "id": "d29767bb-8f5f-4c43-872f-6c73635a1256",
      "name": "V1 Integration",
      "url": "https:\/\/v1platformtest.visualstudio.com\/DefaultCollection\/_apis\/git\/repositories\/d29767bb-8f5f-4c43-872f-6c73635a1256",
      "project": {
        "id": "213b6eda-2f19-4651-9fa9-ee01a9a75945",
        "name": "V1 Integration",
        "url": "https:\/\/v1platformtest.visualstudio.com\/DefaultCollection\/_apis\/projects\/213b6eda-2f19-4651-9fa9-ee01a9a75945",
        "state": "wellFormed"
      },
      "defaultBranch": "refs\/heads\/master",
      "remoteUrl": "https:\/\/v1platformtest.visualstudio.com\/DefaultCollection\/_git\/V1 Integration"
    },
    "pushedBy": {
      "id": "0b88cae0-021f-4fa0-b723-d670c74ae474",
      "displayName": "Josh Gough",
      "uniqueName": "jsgough@gmail.com",
      "url": "https:\/\/v1platformtest.vssps.visualstudio.com\/_apis\/Identities\/0b88cae0-021f-4fa0-b723-d670c74ae474",
      "imageUrl": "https:\/\/v1platformtest.visualstudio.com\/DefaultCollection\/_api\/_common\/identityImage?id=0b88cae0-021f-4fa0-b723-d670c74ae474"
    },
    "pushId": 5,
    "date": "2015-11-11T18:24:39.1284911Z",
    "url": "https:\/\/v1platformtest.visualstudio.com\/DefaultCollection\/_apis\/git\/repositories\/d29767bb-8f5f-4c43-872f-6c73635a1256\/pushes\/5",
    "_links": {
      "self": {
        "href": "https:\/\/v1platformtest.visualstudio.com\/DefaultCollection\/_apis\/git\/repositories\/d29767bb-8f5f-4c43-872f-6c73635a1256\/pushes\/5"
      },
      "repository": {
        "href": "https:\/\/v1platformtest.visualstudio.com\/DefaultCollection\/_apis\/git\/repositories\/d29767bb-8f5f-4c43-872f-6c73635a1256"
      },
      "commits": {
        "href": "https:\/\/v1platformtest.visualstudio.com\/DefaultCollection\/_apis\/git\/repositories\/d29767bb-8f5f-4c43-872f-6c73635a1256\/pushes\/5\/commits"
      },
      "pusher": {
        "href": "https:\/\/v1platformtest.vssps.visualstudio.com\/_apis\/Identities\/0b88cae0-021f-4fa0-b723-d670c74ae474"
      },
      "refs": {
        "href": "https:\/\/v1platformtest.visualstudio.com\/DefaultCollection\/_apis\/git\/repositories\/d29767bb-8f5f-4c43-872f-6c73635a1256\/refs"
      }
    }
  },
  "resourceVersion": "1.0-preview.1",
  "createdDate": "2015-11-11T18:24:43.2180411Z"
}
*/
module.exports = exports['default'];
