var chai = require('chai'),
  should = chai.should(),
  proxyquire = require('proxyquire'),
  sinon = require('sinon'),
  uuidStub = sinon.stub(),
  GitHubCommitMalformedError = require('../../../middleware/gitHubCommitMalformedError'),
  githubTranslator = proxyquire('../../../api/translators/githubTranslator', {
    'uuid-v4': uuidStub
  });
require('../../helpers')(global);

// Test data:
var pushEventMessageWithOneCommit = {
  "ref": "refs/heads/teamRoomUX2_S-51083",
  "before": "300417ed43da3a6819d9ee329e06275e0a377a0c",
  "after": "3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
  "created": false,
  "deleted": false,
  "forced": false,
  "base_ref": null,
  "compare": "https://github.com/openAgile/CommitStream.Web/compare/300417ed43da...3b80fa1b0b56",
  "commits": [{
    "id": "3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
    "distinct": true,
    "message": "Renamed templates. S-51083",
    "timestamp": "2015-01-19T17:00:17-03:00",
    "url": "https://github.com/openAgile/CommitStream.Web/commit/3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
    "author": {
      "name": "kunzimariano",
      "email": "kunzi.mariano@gmail.com",
      "username": "kunzimariano"
    },
    "committer": {
      "name": "kunzimariano",
      "email": "kunzi.mariano@gmail.com",
      "username": "kunzimariano"
    },
    "added": [
      "src/app/client/commitsContainer.html",
      "src/app/client/commitsList.html"
    ],
    "removed": [
      "src/app/client/assetDetailCommits.html",
      "src/app/client/assetDetailInit.html"
    ],
    "modified": [
      "src/app/views/app.handlebars"
    ]
  }],
  "head_commit": {
    "id": "3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
    "distinct": true,
    "message": "Renamed templates. S-51083",
    "timestamp": "2015-01-19T17:00:17-03:00",
    "url": "https://github.com/openAgile/CommitStream.Web/commit/3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
    "author": {
      "name": "kunzimariano",
      "email": "kunzi.mariano@gmail.com",
      "username": "kunzimariano"
    },
    "committer": {
      "name": "kunzimariano",
      "email": "kunzi.mariano@gmail.com",
      "username": "kunzimariano"
    },
    "added": [
      "src/app/client/commitsContainer.html",
      "src/app/client/commitsList.html"
    ],
    "removed": [
      "src/app/client/assetDetailCommits.html",
      "src/app/client/assetDetailInit.html"
    ],
    "modified": [
      "src/app/views/app.handlebars"
    ]
  },
  "repository": {
    "id": 23838815,
    "name": "CommitStream.Web",
    "full_name": "openAgile/CommitStream.Web",
    "owner": {
      "name": "openAgile",
      "email": null
    },
    "private": false,
    "html_url": "https://github.com/openAgile/CommitStream.Web",
    "description": "CommitStream Web Server",
    "fork": false,
    "url": "https://github.com/openAgile/CommitStream.Web",
    "forks_url": "https://api.github.com/repos/openAgile/CommitStream.Web/forks",
    "keys_url": "https://api.github.com/repos/openAgile/CommitStream.Web/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/openAgile/CommitStream.Web/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/openAgile/CommitStream.Web/teams",
    "hooks_url": "https://api.github.com/repos/openAgile/CommitStream.Web/hooks",
    "issue_events_url": "https://api.github.com/repos/openAgile/CommitStream.Web/issues/events{/number}",
    "events_url": "https://api.github.com/repos/openAgile/CommitStream.Web/events",
    "assignees_url": "https://api.github.com/repos/openAgile/CommitStream.Web/assignees{/user}",
    "branches_url": "https://api.github.com/repos/openAgile/CommitStream.Web/branches{/branch}",
    "tags_url": "https://api.github.com/repos/openAgile/CommitStream.Web/tags",
    "blobs_url": "https://api.github.com/repos/openAgile/CommitStream.Web/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/openAgile/CommitStream.Web/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/openAgile/CommitStream.Web/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/openAgile/CommitStream.Web/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/openAgile/CommitStream.Web/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/openAgile/CommitStream.Web/languages",
    "stargazers_url": "https://api.github.com/repos/openAgile/CommitStream.Web/stargazers",
    "contributors_url": "https://api.github.com/repos/openAgile/CommitStream.Web/contributors",
    "subscribers_url": "https://api.github.com/repos/openAgile/CommitStream.Web/subscribers",
    "subscription_url": "https://api.github.com/repos/openAgile/CommitStream.Web/subscription",
    "commits_url": "https://api.github.com/repos/openAgile/CommitStream.Web/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/openAgile/CommitStream.Web/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/openAgile/CommitStream.Web/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/openAgile/CommitStream.Web/issues/comments/{number}",
    "contents_url": "https://api.github.com/repos/openAgile/CommitStream.Web/contents/{+path}",
    "compare_url": "https://api.github.com/repos/openAgile/CommitStream.Web/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/openAgile/CommitStream.Web/merges",
    "archive_url": "https://api.github.com/repos/openAgile/CommitStream.Web/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/openAgile/CommitStream.Web/downloads",
    "issues_url": "https://api.github.com/repos/openAgile/CommitStream.Web/issues{/number}",
    "pulls_url": "https://api.github.com/repos/openAgile/CommitStream.Web/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/openAgile/CommitStream.Web/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/openAgile/CommitStream.Web/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/openAgile/CommitStream.Web/labels{/name}",
    "releases_url": "https://api.github.com/repos/openAgile/CommitStream.Web/releases{/id}",
    "created_at": 1410275937,
    "updated_at": "2014-12-31T16:07:10Z",
    "pushed_at": 1421697626,
    "git_url": "git://github.com/openAgile/CommitStream.Web.git",
    "ssh_url": "git@github.com:openAgile/CommitStream.Web.git",
    "clone_url": "https://github.com/openAgile/CommitStream.Web.git",
    "svn_url": "https://github.com/openAgile/CommitStream.Web",
    "homepage": "",
    "size": 4074,
    "stargazers_count": 1,
    "watchers_count": 1,
    "language": "JavaScript",
    "has_issues": true,
    "has_downloads": true,
    "has_wiki": true,
    "has_pages": false,
    "forks_count": 3,
    "mirror_url": null,
    "open_issues_count": 1,
    "forks": 3,
    "open_issues": 1,
    "watchers": 1,
    "default_branch": "master",
    "stargazers": 1,
    "master_branch": "master",
    "organization": "openAgile"
  },
  "pusher": {
    "name": "kunzimariano",
    "email": "kunzi.mariano@gmail.com"
  },
  "organization": {
    "login": "openAgile",
    "id": 6954603,
    "url": "https://api.github.com/orgs/openAgile",
    "repos_url": "https://api.github.com/orgs/openAgile/repos",
    "events_url": "https://api.github.com/orgs/openAgile/events",
    "members_url": "https://api.github.com/orgs/openAgile/members{/member}",
    "public_members_url": "https://api.github.com/orgs/openAgile/public_members{/member}",
    "avatar_url": "https://avatars.githubusercontent.com/u/6954603?v=3",
    "description": null
  },
  "sender": {
    "login": "kunzimariano",
    "id": 1418295,
    "avatar_url": "https://avatars.githubusercontent.com/u/1418295?v=3",
    "gravatar_id": "",
    "url": "https://api.github.com/users/kunzimariano",
    "html_url": "https://github.com/kunzimariano",
    "followers_url": "https://api.github.com/users/kunzimariano/followers",
    "following_url": "https://api.github.com/users/kunzimariano/following{/other_user}",
    "gists_url": "https://api.github.com/users/kunzimariano/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/kunzimariano/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/kunzimariano/subscriptions",
    "organizations_url": "https://api.github.com/users/kunzimariano/orgs",
    "repos_url": "https://api.github.com/users/kunzimariano/repos",
    "events_url": "https://api.github.com/users/kunzimariano/events{/privacy}",
    "received_events_url": "https://api.github.com/users/kunzimariano/received_events",
    "type": "User",
    "site_admin": false
  }
};

var pushEventWithSlashInBranchName = clone(pushEventMessageWithOneCommit);
pushEventWithSlashInBranchName.ref = 'refs/heads/my-cool-feature/the-thing-we-broke/and-now-we-fix';

var pushEventMessageWithoutRequiredProperty = {
  "ref": "refs/heads/teamRoomUX2_S-51083",
  "before": "300417ed43da3a6819d9ee329e06275e0a377a0c",
  "after": "3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
  "created": false,
  "deleted": false,
  "forced": false,
  "base_ref": null,
  "compare": "https://github.com/openAgile/CommitStream.Web/compare/300417ed43da...3b80fa1b0b56",
  "commits": [{
    "id": "3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
    "distinct": true,
    "message": "Renamed templates. S-51083",
    "timestamp": "2015-01-19T17:00:17-03:00",
    "url": "https://github.com/openAgile/CommitStream.Web/commit/3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
    "author": {
      "name": "kunzimariano",
      "email": "kunzi.mariano@gmail.com",
      "username": "kunzimariano"
    },
    "committer": {
      "name": "kunzimariano",
      "email": "kunzi.mariano@gmail.com",
      "username": "kunzimariano"
    },
    "added": [
      "src/app/client/commitsContainer.html",
      "src/app/client/commitsList.html"
    ],
    "removed": [
      "src/app/client/assetDetailCommits.html",
      "src/app/client/assetDetailInit.html"
    ],
    "modified": [
      "src/app/views/app.handlebars"
    ]
  }],
  "head_commit": {
    "id": "3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
    "distinct": true,
    "message": "Renamed templates. S-51083",
    "timestamp": "2015-01-19T17:00:17-03:00",
    "url": "https://github.com/openAgile/CommitStream.Web/commit/3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
    "author": {
      "name": "kunzimariano",
      "email": "kunzi.mariano@gmail.com",
      "username": "kunzimariano"
    },
    "committer": {
      "name": "kunzimariano",
      "email": "kunzi.mariano@gmail.com",
      "username": "kunzimariano"
    },
    "added": [
      "src/app/client/commitsContainer.html",
      "src/app/client/commitsList.html"
    ],
    "removed": [
      "src/app/client/assetDetailCommits.html",
      "src/app/client/assetDetailInit.html"
    ],
    "modified": [
      "src/app/views/app.handlebars"
    ]
  },
  "pusher": {
    "name": "kunzimariano",
    "email": "kunzi.mariano@gmail.com"
  },
  "organization": {
    "login": "openAgile",
    "id": 6954603,
    "url": "https://api.github.com/orgs/openAgile",
    "repos_url": "https://api.github.com/orgs/openAgile/repos",
    "events_url": "https://api.github.com/orgs/openAgile/events",
    "members_url": "https://api.github.com/orgs/openAgile/members{/member}",
    "public_members_url": "https://api.github.com/orgs/openAgile/public_members{/member}",
    "avatar_url": "https://avatars.githubusercontent.com/u/6954603?v=3",
    "description": null
  },
  "sender": {
    "login": "kunzimariano",
    "id": 1418295,
    "avatar_url": "https://avatars.githubusercontent.com/u/1418295?v=3",
    "gravatar_id": "",
    "url": "https://api.github.com/users/kunzimariano",
    "html_url": "https://github.com/kunzimariano",
    "followers_url": "https://api.github.com/users/kunzimariano/followers",
    "following_url": "https://api.github.com/users/kunzimariano/following{/other_user}",
    "gists_url": "https://api.github.com/users/kunzimariano/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/kunzimariano/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/kunzimariano/subscriptions",
    "organizations_url": "https://api.github.com/users/kunzimariano/orgs",
    "repos_url": "https://api.github.com/users/kunzimariano/repos",
    "events_url": "https://api.github.com/users/kunzimariano/events{/privacy}",
    "received_events_url": "https://api.github.com/users/kunzimariano/received_events",
    "type": "User",
    "site_admin": false
  }
};

describe('githubTranslator', function() {
  var eventId = '87b66de8-8307-4e03-b2d3-da447c66501a';
  uuidStub.returns(eventId);

  var digestId = 'cd0b1089-7d6d-435a-adf2-125209b1c2c8';
  var instanceId = 'c4abe8e0-e4af-4cc0-8dee-92e698015694';
  var inboxId = 'f68ad5b0-f0e2-428d-847d-1302322eeeb1';

  describe('when translating a push event that contains one commit', function() {
    var expected = [{
      eventId: eventId,
      eventType: "GitHubCommitReceived",
      data: {
        sha: "3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
        commit: {
          author: {
            "name": "kunzimariano",
            "email": "kunzi.mariano@gmail.com",
            "username": "kunzimariano"
          },
          committer: {
            name: "kunzimariano",
            email: "kunzi.mariano@gmail.com",
            date: "2015-01-19T17:00:17-03:00"
          },
          message: "Renamed templates. S-51083"
        },
        html_url: "https://github.com/openAgile/CommitStream.Web/commit/3b80fa1b0b5641443d9ef59b95b98d1f21e160f6",
        repository: {
          id: 23838815,
          name: "CommitStream.Web"
        },
        branch: "teamRoomUX2_S-51083",
        originalMessage: pushEventMessageWithOneCommit.commits[0]
      },
      metadata: {
        instanceId: instanceId,
        digestId: digestId,
        inboxId: inboxId
      }
    }];

    var actual = githubTranslator.translatePush(pushEventMessageWithOneCommit, instanceId, digestId, inboxId);

    it('should match the expected translation', function() {
      actual.should.deep.equal(expected);
    });
  });

  describe('when translating a malformed push event', function() {
    var invokeTranslatePush;

    beforeEach(function() {
      invokeTranslatePush = function() {
        var malformedPushEvent = {};
        var instanceId = '73b40eab-bbb9-4478-9031-601b9e701d17',
            digestId = '9c369aef-b041-4a38-a76c-d3cf59dec0d2',
            inboxId = '9c369aef-b041-4a38-a76c-d3cf59dec0d2';

        githubTranslator.translatePush(malformedPushEvent, instanceId, digestId, inboxId)
      }
    });

    it('should throw GitHubCommitMalformedError', function() {
      invokeTranslatePush.should.throw(GitHubCommitMalformedError);
    });
  });

  describe('when translating a push event', function() {
    it('should parse branch names with slashes correctly', function() {
      var expectedBranchName = 'my-cool-feature/the-thing-we-broke/and-now-we-fix';
      var actual = githubTranslator.translatePush(pushEventWithSlashInBranchName, instanceId, digestId, inboxId);
      actual[0].data.branch.should.equal(expectedBranchName);
    });
  });

});