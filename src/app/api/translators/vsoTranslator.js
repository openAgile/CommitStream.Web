/*

{
  "subscriptionId":"a36104aa-ef6c-4643-ac08-5c42fd2115d3",
  "notificationId":2,
  "id":"d15fb1f5-87a4-4dc9-9988-2049360f4c73",
  "eventType":"git.push",
  "publisherId":"tfs",
  "message":{
    "text":"Josh Gough pushed updates to branch master of V1 Integration\r\n(https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/#version=GBmaster)",
    "html":"Josh Gough pushed updates to branch <a href=\"https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/#version=GBmaster\">master</a> of <a href=\"https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1 Integration/\">V1 Integration</a>",
    "markdown":"Josh Gough pushed updates to branch [master](https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/#version=GBmaster) of [V1 Integration](https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1 Integration/)"
  },
  "detailedMessage":{
    "text":"Josh Gough pushed 1 commit to branch master of V1 Integration\r\n - S-11111 Going back to VSO f4556501 (https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/commit/f4556501dcd6aa8d5af766ea6ed797da92d59f79)",
    "html":"Josh Gough pushed 1 commit to branch <a href=\"https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/#version=GBmaster\">master</a> of <a href=\"https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1 Integration/\">V1 Integration</a>\r\n<ul>\r\n<li>S-11111 Going back to VSO <a href=\"https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/commit/f4556501dcd6aa8d5af766ea6ed797da92d59f79\">f4556501</a></li>\r\n</ul>",
    "markdown":"Josh Gough pushed 1 commit to branch [master](https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/#version=GBmaster) of [V1 Integration](https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1 Integration/)\r\n* S-11111 Going back to VSO [f4556501](https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1%20Integration/commit/f4556501dcd6aa8d5af766ea6ed797da92d59f79)"
  },
  "resource":{
    "commits":[
      {
        "commitId":"f4556501dcd6aa8d5af766ea6ed797da92d59f79",
        "author":{
          "name":"Josh Gough",
          "email":"jsgough@gmail.com",
          "date":"2015-05-07T18:34:10Z"
        },
        "committer":{
          "name":"Josh Gough",
          "email":"jsgough@gmail.com",
          "date":"2015-05-07T18:34:10Z"
        },
        "comment":"S-11111 Going back to VSO",
        "url":"https://v1platformtest.visualstudio.com/DefaultCollection/_apis/git/repositories/d29767bb-8f5f-4c43-872f-6c73635a1256/commits/f4556501dcd6aa8d5af766ea6ed797da92d59f79"
      }
    ],
    "refUpdates":[
      {
        "name":"refs/heads/master",
        "oldObjectId":"8eb977bb5576675d70a1c84a55beaf398b20d2b9",
        "newObjectId":"f4556501dcd6aa8d5af766ea6ed797da92d59f79"
      }
    ],
    "repository":{
      "id":"d29767bb-8f5f-4c43-872f-6c73635a1256",
      "name":"V1 Integration",
      "url":"https://v1platformtest.visualstudio.com/DefaultCollection/_apis/git/repositories/d29767bb-8f5f-4c43-872f-6c73635a1256",
      "project":{
        "id":"213b6eda-2f19-4651-9fa9-ee01a9a75945",
        "name":"V1 Integration",
        "url":"https://v1platformtest.visualstudio.com/DefaultCollection/_apis/projects/213b6eda-2f19-4651-9fa9-ee01a9a75945",
        "state":"wellFormed"
      },
      "defaultBranch":"refs/heads/master",
      "remoteUrl":"https://v1platformtest.visualstudio.com/DefaultCollection/_git/V1 Integration"
    },
    "pushedBy":{
      "id":"0b88cae0-021f-4fa0-b723-d670c74ae474",
      "displayName":"Josh Gough",
      "uniqueName":"jsgough@gmail.com",
      "url":"https://v1platformtest.vssps.visualstudio.com/_apis/Identities/0b88cae0-021f-4fa0-b723-d670c74ae474",
      "imageUrl":"https://v1platformtest.visualstudio.com/DefaultCollection/_api/_common/identityImage?id=0b88cae0-021f-4fa0-b723-d670c74ae474"
    },
    "pushId":3,
    "date":"2015-05-07T18:32:44.4177234Z",
    "url":"https://v1platformtest.visualstudio.com/DefaultCollection/_apis/git/repositories/d29767bb-8f5f-4c43-872f-6c73635a1256/pushes/3",
    "_links":{
      "self":{
        "href":"https://v1platformtest.visualstudio.com/DefaultCollection/_apis/git/repositories/d29767bb-8f5f-4c43-872f-6c73635a1256/pushes/3"
      },
      "repository":{
        "href":"https://v1platformtest.visualstudio.com/DefaultCollection/_apis/git/repositories/d29767bb-8f5f-4c43-872f-6c73635a1256"
      },
      "commits":{
        "href":"https://v1platformtest.visualstudio.com/DefaultCollection/_apis/git/repositories/d29767bb-8f5f-4c43-872f-6c73635a1256/pushes/3/commits"
      },
      "pusher":{
        "href":"https://v1platformtest.vssps.visualstudio.com/_apis/Identities/0b88cae0-021f-4fa0-b723-d670c74ae474"
      },
      "refs":{
        "href":"https://v1platformtest.visualstudio.com/DefaultCollection/_apis/git/repositories/d29767bb-8f5f-4c43-872f-6c73635a1256/refs"
      }
    }
  },
  "resourceVersion":"1.0-preview.1",
  "createdDate":"2015-05-07T18:32:45.1869649Z"
}


*/

(function(vsoTranslator) {
  var _ = require('underscore'),
    uuid = require('uuid-v4'),
    csError = require('../../middleware/csError');

  vsoTranslator.VsoCommitMalformedError = csError.createCustomError('VsoCommitMalformedError', function(error, pushEvent) {
    this.originalError = error;
    var errors = [error.toString()];
    this.pushEvent = pushEvent;
    vsoTranslator.VsoCommitMalformedError.prototype.constructor.call(this, errors, 400);
  });

  vsoTranslator.validate = function(req) {
    // TODO what is there to do here?
    return true;
  };

  vsoTranslator.hasCommits = function(req) {
    // TODO what is there to do here? Check the structure of the data itself?
    return true;
  };

  vsoTranslator.respondToNonCommitsMessage = function(req, res) {
    // TODO what about this?
    res.json({
      message: 'No VSO commits found'
    });    
  };  

  vsoTranslator.translatePush = function(pushEvent, instanceId, digestId, inboxId) {
    try {
      var branch = pushEvent.resource.refUpdates[0].name.split('/').pop();
      var repository = {
        id: pushEvent.resource.repository.id,
        name: pushEvent.resource.repository.name
      };

      var events = _.map(pushEvent.resource.commits, function(aCommit) {
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
          html_url: aCommit.url,
          repository: repository,
          branch: branch,
          originalMessage: aCommit
        };
        return {
          eventId: uuid(),
          eventType: 'VsoCommitReceived',
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
      var otherEx = new vsoTranslator.VsoCommitMalformedError(ex, pushEvent);
      throw otherEx;
    }
  };
  
}(module.exports));