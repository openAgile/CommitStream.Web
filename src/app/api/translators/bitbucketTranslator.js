/*
{
  "repository":{
    "website":"",
    "fork":false,
    "name":"CSTest",
    "scm":"git",
    "owner":"JoshGough",
    "absolute_url":"/JoshGough/cstest/",
    "slug":"cstest",
    "is_private":false
  },
  "truncated":false,
  "commits":[
    {
      "node":"391f9dac0699",
      "files":[
        {
          "type":"modified",
          "file":"README.md"
        }
      ],
      "raw_author":"Josh Gough <jsgough@gmail.com>",
      "utctimestamp":"2015-05-07 18:59:17+00:00",
      "author":"JoshGough",
      "timestamp":"2015-05-07 20:59:17",
      "raw_node":"391f9dac06994d6979e7df2de2eb92a641f16640",
      "parents":[
        "dde06d705b55"
      ],
      "branch":"master",
      "message":"S-11111 going to BitBucket\n",
      "revision":null,
      "size":-1
    }
  ],
  "canon_url":"https://bitbucket.org",
  "user":"JoshGough"
}
*/
(function(bitbucketTranslator) {
  var _ = require('underscore'),
    uuid = require('uuid-v4'),
    csError = require('../../middleware/csError');

  bitbucketTranslator.BitbucketCommitMalformedError = csError.createCustomError('BitbucketCommitMalformedError', function(error, pushEvent) {
    this.originalError = error;
    var errors = [error.toString()];
    this.pushEvent = pushEvent;
    bitbucketTranslator.BitbucketCommitMalformedError.prototype.constructor.call(this, errors, 400);
  });

  bitbucketTranslator.validate = function(req) {
    // TODO what is there to do here?
    return true;
  };

  bitbucketTranslator.hasCommits = function(req) {
    // TODO what is there to do here? Check the structure of the data itself?
    return true;
  };

  bitbucketTranslator.respondToNonCommitsMessage = function(req, res) {
    // TODO what about this?
    res.json({
      message: 'No Bitbucket commits found'
    });    
  };  

  bitbucketTranslator.translatePush = function(pushEvent, instanceId, digestId, inboxId) {
    try {      
      pushEvent = JSON.parse(pushEvent.payload);

      var canon_url = pushEvent.canon_url;
      var absolute_url = pushEvent.repository.absolute_url;
      var repo_url = canon_url + absolute_url;

      var branch = '';

      var repository = {
        id: pushEvent.repository.name, // there is no id
        name: pushEvent.repository.name
      };

      var events = _.map(pushEvent.commits, function(aCommit) {
        var authorParts = aCommit.raw_author.split('<');
        var authorEmail = authorParts[1];
        authorEmail = authorEmail.substr(0, authorEmail.length - 1);
        
        var commit = {
          sha: aCommit.raw_node,
          commit: {
            author: {
              name: aCommit.author,
              email: authorEmail
            },
            committer: {
              name: aCommit.author,
              email: authorEmail,
              date: aCommit.utctimestamp
            },
            message: aCommit.message
          },
          html_url: repo_url + 'commits/' + aCommit.raw_node,
          repository: repository,
          branch: branch,
          originalMessage: aCommit
        };
        return {
          eventId: uuid(),
          eventType: 'BitbucketCommitReceived',
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
      var otherEx = new bitbucketTranslator.BitbucketCommitMalformedError(ex, pushEvent);
      throw otherEx;
    }
  };
  
}(module.exports));