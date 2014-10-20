var assert = require("assert"),    
    gitHubEventsToApiResponse = require('../gitHubEventsToApiResponse');

var eventsData = {};

eventsData.Single = [
	{
    "title": "95@github-events",
    "id": "http://localhost:2113/streams/github-events/95",
    "updated": "2014-10-02T14:12:09.4125355Z",
    "author": {
        "name": "EventStore"
    },
    "summary": "github-event",
    "content": {
        "eventStreamId": "github-events",
        "eventNumber": 95,
        "eventType": "github-event",
        "data": {
            "sha": "a90603404e4793ce9fa88a93abb4e96b89a3e9bc",
            "commit": {
                "author": {
                    "name": "Josh Gough",
                    "email": "jsgough@gmail.com",
                    "date": "2014-09-26T20:44:06Z"
                },
                "committer": {
                    "name": "Josh Gough",
                    "email": "jsgough@gmail.com",
                    "date": "2014-09-26T20:44:06Z"
                },
                "message": "S-47665 Take location.search.substring(1) to remove ?",
                "tree": {
                    "sha": "43089b4a7fb97b426fe4c1c254db6262d52cb78a",
                    "url": "https://api.github.com/repos/openAgile/CommitStream.Web/git/trees/43089b4a7fb97b426fe4c1c254db6262d52cb78a"
                },
                "url": "https://api.github.com/repos/openAgile/CommitStream.Web/git/commits/a90603404e4793ce9fa88a93abb4e96b89a3e9bc",
                "comment_count": 0
            },
            "url": "https://api.github.com/repos/openAgile/CommitStream.Web/commits/a90603404e4793ce9fa88a93abb4e96b89a3e9bc",
            "html_url": "https://github.com/openAgile/CommitStream.Web/commit/a90603404e4793ce9fa88a93abb4e96b89a3e9bc",
            "comments_url": "https://api.github.com/repos/openAgile/CommitStream.Web/commits/a90603404e4793ce9fa88a93abb4e96b89a3e9bc/comments",
            "author": {
                "login": "JogoShugh",
                "id": 1863005,
                "avatar_url": "https://avatars.githubusercontent.com/u/1863005?v=2",
                "gravatar_id": "",
                "url": "https://api.github.com/users/JogoShugh",
                "html_url": "https://github.com/JogoShugh",
                "followers_url": "https://api.github.com/users/JogoShugh/followers",
                "following_url": "https://api.github.com/users/JogoShugh/following{/other_user}",
                "gists_url": "https://api.github.com/users/JogoShugh/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/JogoShugh/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/JogoShugh/subscriptions",
                "organizations_url": "https://api.github.com/users/JogoShugh/orgs",
                "repos_url": "https://api.github.com/users/JogoShugh/repos",
                "events_url": "https://api.github.com/users/JogoShugh/events{/privacy}",
                "received_events_url": "https://api.github.com/users/JogoShugh/received_events",
                "type": "User",
                "site_admin": false
            },
            "committer": {
                "login": "JogoShugh",
                "id": 1863005,
                "avatar_url": "https://avatars.githubusercontent.com/u/1863005?v=2",
                "gravatar_id": "",
                "url": "https://api.github.com/users/JogoShugh",
                "html_url": "https://github.com/JogoShugh",
                "followers_url": "https://api.github.com/users/JogoShugh/followers",
                "following_url": "https://api.github.com/users/JogoShugh/following{/other_user}",
                "gists_url": "https://api.github.com/users/JogoShugh/gists{/gist_id}",
                "starred_url": "https://api.github.com/users/JogoShugh/starred{/owner}{/repo}",
                "subscriptions_url": "https://api.github.com/users/JogoShugh/subscriptions",
                "organizations_url": "https://api.github.com/users/JogoShugh/orgs",
                "repos_url": "https://api.github.com/users/JogoShugh/repos",
                "events_url": "https://api.github.com/users/JogoShugh/events{/privacy}",
                "received_events_url": "https://api.github.com/users/JogoShugh/received_events",
                "type": "User",
                "site_admin": false
            },
            "parents": [
	        {
                "sha": "e3c5579002b73efc22c544622fb3156183a95a72",
                "url": "https://api.github.com/repos/openAgile/CommitStream.Web/commits/e3c5579002b73efc22c544622fb3156183a95a72",
                "html_url": "https://github.com/openAgile/CommitStream.Web/commit/e3c5579002b73efc22c544622fb3156183a95a72"
            }
	      ],
            "stats": {
                "total": 2,
                "additions": 1,
                "deletions": 1
            },
            "files": [
	        {
                "sha": "408ba0915291ef916fc6949945c3e9d51a259206",
                "filename": "client/index.html",
                "status": "modified",
                "additions": 1,
                "deletions": 1,
                "changes": 2,
                "blob_url": "https://github.com/openAgile/CommitStream.Web/blob/a90603404e4793ce9fa88a93abb4e96b89a3e9bc/client/index.html",
                "raw_url": "https://github.com/openAgile/CommitStream.Web/raw/a90603404e4793ce9fa88a93abb4e96b89a3e9bc/client/index.html",
                "contents_url": "https://api.github.com/repos/openAgile/CommitStream.Web/contents/client/index.html?ref=a90603404e4793ce9fa88a93abb4e96b89a3e9bc",
                "patch": "@@ -6,7 +6,7 @@\n $(function() {\n   $.getScript('http://v1commitstream.azurewebsites.net/app.js',\n     function(data, status, jqxhr) {\n-      var assetNumber = location.search || 'S-47665';\n+      var assetNumber = location.search.substring(1) || 'S-47665';\n       CommitStream.commitsDisplay('#commits', assetNumber);\n     });\n });   "
            }
	      ]
        },
        "metadata": ""
    }
}
];

describe('gitHubEventsToApiResponse', function () {
    describe('when 0 events present', function () {
        it('returns an empty array', function () {
            assert.deepEqual(gitHubEventsToApiResponse([]), { commits: [] })
        });
    });
    
    describe('when 1 event present', function () {
        var events = eventsData.Single;
        var actual = gitHubEventsToApiResponse(events);
        it('returns a 1 mapped event', function () {
            assert.equal(actual.commits.length, 1);
        });
    });
});