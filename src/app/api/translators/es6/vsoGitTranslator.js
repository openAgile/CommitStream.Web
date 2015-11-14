import util from 'util';
import uuid from 'uuid-v4';
import CSError from '../../middleware/csError';

class VsoGitCommitMalformedError extends CSError {
  constructor(error, pushEvent) {
    super(['There was an unexpected error when processing your Visual Studio Online Git push event.']);
    this.originalError = error;
    this.pushEvent = pushEvent;
  }
}

const vsoGitTranslator = {
  family: 'VsoGit',
  canTranslate(request) {
    return (request.body.eventType && request.body.eventType === 'git.push') 
    && (request.body.publisherId && request.body.publisherId === 'tfs');
  },
  translatePush(pushEvent, instanceId, digestId, inboxId) {
    try {
      let branchParts = pushEvent.resource.refUpdates[0].name.split('/');
      // knock off the prefixing stuff
      branchParts.shift();
      branchParts.shift();
      let branch;
      if (branchParts.length > 1) branch = branchParts.join('/');
      else branch = branchParts[0];
      const repository = {
        id: pushEvent.resource.repository.id,
        name: pushEvent.resource.repository.name
      };

      const getHtmlCommitUrl = theCommit => {
        const repositoryName = encodeURIComponent(pushEvent.resource.repository.name);
        // Original format: https://v1platformtest.visualstudio.com/DefaultCollection/_apis/git/repositories/d29767bb-8f5f-4c43-872f-6c73635a1256/commits/e771d9b9d5abab2da4107a0e6db05cef21e40ce8
        // Expected format: https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/commit/e771d9b9d5abab2da4107a0e6db05cef21e40ce8
        const url = theCommit.url.replace(/_apis\/git\/repositories\/.*?\/commits\//i, `_git/${repositoryName}/commit/`);
        return url;
      };

      const events = pushEvent.resource.commits.map(aCommit => {
        const commit = {
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
          eventId: uuid(),
          eventType: 'VsoGitCommitReceived',
          data: commit,
          metadata: {
            instanceId: instanceId,
            digestId: digestId,
            inboxId: inboxId
          }
        };
      });
      return events;
    } catch (ex) {
      const malformedEx = new VsoGitCommitMalformedError(ex, pushEvent);
      throw malformedEx;
    }    
  },
  getProperties(event) {
    const commit = event.commit;
    const branch = event.branch;
    const html_url = event.html_url;
    const props = {
      repo: '',
      branchHref: '',
      repoHref: ''
    };

    const urlComponents = html_url.match(/http.?:\/\/(.*?)\..*?_git\/(.*?)\/commit/);
    const serverUrlMatch = html_url.match(/(http.?:)\/\/(.*?_git)\//);
    if (urlComponents !== null && serverUrlMatch !== null) {
      const repoName = urlComponents[2];
      const repoOwner = urlComponents[1];
      const protocol = serverUrlMatch[1];
      const serverUrl = protocol + '//' + serverUrlMatch[2];
      props.repo = `${repoOwner}/${decodeURIComponent(repoName)}`;
      props.repoHref =  serverUrl + '/' + encodeURIComponent(props.repoName);
      props.branchHref =  props.repoHref + '/#version=GB' + encodeURIComponent(branch);
    } else {
      // TODO: use proper error here
      throw 'Could not parse VsoGitCommitReceived event props correctly.';
    }

    return props;
  }
}

export default vsoGitTranslator;


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