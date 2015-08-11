// FORM/POST PARAMETERS
// None
// HEADERS

// Content-Length: 954

// Host: requestb.in

// X-Gitlab-Event: Push Hook

// Total-Route-Time: 0

// X-Request-Id: ca31f1a6-b95b-4fb9-ad33-bd5b9cdb8be0

// Connect-Time: 2

// Content-Type: application/json

// Connection: close

// Via: 1.1 vegur

// matiasheffel [5:01 PM]
// the raw body

// matiasheffel [5:01 PM]
// {"object_kind":"push","before":"8fa95cebec33f63f8e080ffbd11f7b8bae61f9c6","after":"95071710195f2aefc4ba7a5a2fd7d119b4123482","ref":"refs/heads/master","checkout_sha":"95071710195f2aefc4ba7a5a2fd7d119b4123482","message":null,"user_id":1,"user_name":"Administrator","user_email":"user@example.com","project_id":1,"repository":{"name":"gitlab-project-test","url":"git@137.135.123.9:user/gitlab-project-test.git","description":"","homepage":"http://137.135.123.9/user/gitlab-project-test","git_http_url":"http://137.135.123.9/user/gitlab-project-test.git","git_ssh_url":"git@137.135.123.9:user/gitlab-project-test.git","visibility_level":20},"commits":[{"id":"95071710195f2aefc4ba7a5a2fd7d119b4123482","message":"S-0001 hello\n","timestamp":"2015-08-05T18:00:13-03:00","url":"http://137.135.123.9/user/gitlab-project-test/commit/95071710195f2aefc4ba7a5a2fd7d119b4123482","author":{"name":"Administrator","email":"user@example.com"}}],"total_commits_count":1}

// http://requestb.in/1mazrmi1?inspect

/*
{
  "object_kind": "push",
  "before": "95790bf891e76fee5e1747ab589903a6a1f80f22",
  "after": "da1560886d4f094c3e6c9ef40349f7d38b5d27d7",
  "ref": "refs/heads/master",
  "user_id": 4,
  "user_name": "John Smith",
  "user_email": "john@example.com",
  "project_id": 15,
  "repository": {
    "name": "Diaspora",
    "url": "git@example.com:mike/diasporadiaspora.git",
    "description": "",
    "homepage": "http://example.com/mike/diaspora",
    "git_http_url":"http://example.com/mike/diaspora.git",
    "git_ssh_url":"git@example.com:mike/diaspora.git",
    "visibility_level":0
  },
  "commits": [
    {
      "id": "b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327",
      "message": "Update Catalan translation to e38cb41.",
      "timestamp": "2011-12-12T14:27:31+02:00",
      "url": "http://example.com/mike/diaspora/commit/b6568db1bc1dcd7f8b4d5a946b0b91f9dacd7327",
      "author": {
        "name": "Jordi Mallach",
        "email": "jordi@softcatala.org"
      }
    },
    {
      "id": "da1560886d4f094c3e6c9ef40349f7d38b5d27d7",
      "message": "fixed readme",
      "timestamp": "2012-01-03T23:36:29+02:00",
      "url": "http://example.com/mike/diaspora/commit/da1560886d4f094c3e6c9ef40349f7d38b5d27d7",
      "author": {
        "name": "GitLab dev user",
        "email": "gitlabdev@dv6700.(none)"
      }
    }
  ],
  "total_commits_count": 4
}
*/

'use strict';

(function (gitLabTranslator) {
  var _ = require('underscore'),
      uuid = require('uuid-v4');

  gitLabTranslator.hasCorrectHeaders = function (headers) {
    return headers.hasOwnProperty('x-gitlab-event') && headers['x-gitlab-event'] === 'Push Hook';
  };

  gitLabTranslator.canTranslate = function (request) {

    // gitLab does not have a pusheEvent.repository.id field, and github does
    // gitLab does not have a commit.committer object, and github does
    var headers = request.headers;

    if (gitLabTranslator.hasCorrectHeaders(headers)) {
      return true;
    }
    return false;
  };

  gitLabTranslator.translatePush = function (pushEvent, instanceId, digestId, inboxId) {
    try {
      var branch = pushEvent.ref.split('/').pop();
      var repository = {
        // gitLab does not have a repository id
        // id: pushEvent.repository.id,
        name: pushEvent.repository.name
      };

      var events = _.map(pushEvent.commits, function (aCommit) {
        var commit = {
          sha: aCommit.id,
          commit: {
            author: aCommit.author,
            // gitLab does not have a commit.committer object. Using the same thing as author for now.
            // committer: {
            //   name: aCommit.committer.name,
            //   email: aCommit.committer.email,
            //   date: aCommit.timestamp
            // },
            committer: {
              name: aCommit.author.name,
              email: aCommit.author.email,
              date: aCommit.timestamp
            },
            message: aCommit.message
          },
          html_url: aCommit.url,
          repository: repository,
          branch: branch,
          originalMessage: aCommit
        };
        return {
          eventId: uuid(),
          eventType: 'GitLabCommitReceived',
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
      console.log('GitLabException:');
      console.log(ex);
      throw ex;
    }
  };

  gitLabTranslator.translatePush = function (pushEvent, instanceId, digestId, inboxId) {
    try {
      var branch = pushEvent.ref.split('/').pop();
      var repository = {
        // gitLab does not have a repository id
        // id: pushEvent.repository.id,
        name: pushEvent.repository.name
      };

      var events = _.map(pushEvent.commits, function (aCommit) {
        var commit = {
          sha: aCommit.id,
          commit: {
            author: aCommit.author,
            // gitLab does not have a commit.committer object. Using the same thing as author for now.
            // committer: {
            //   name: aCommit.committer.name,
            //   email: aCommit.committer.email,
            //   date: aCommit.timestamp
            // },
            committer: {
              name: aCommit.author.name,
              email: aCommit.author.email,
              date: aCommit.timestamp
            },
            message: aCommit.message
          },
          html_url: aCommit.url,
          repository: repository,
          branch: branch,
          originalMessage: aCommit
        };
        return {
          eventId: uuid(),
          eventType: 'GitLabCommitReceived',
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
      console.log('GitLabException:');
      console.log(ex);
      throw ex;
    }
  };
})(module.exports);
