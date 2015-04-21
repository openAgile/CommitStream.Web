(function() {
  module.exports = {
    testData: {
      instances: {
        validInstance1: {
          instanceId: ''
        },
        validInstance2: {
          instanceId: ''
        }
      },
      commits: {
        wellFormedCommitsSample1: {
          "ref": "refs/heads/master",
          "commits": [{
            "id": "b42c285e1506edac965g92573a2121700fc92f8b",
            "distinct": true,
            "message": "S-11111 Hey all this stuff broke today, what's wrong?",
            "timestamp": "2014-10-03T15:57:14-03:00",
            "url": "https://github.com/kunzimariano/CommitService.DemoRepo/commit/b42c285e1506edac965g92573a2121700fc92f8b",
            "author": {
              "name": "marieshawn",
              "email": "abbott.shawn@versionone.com",
              "username": "shawnmarie"
            },
            "committer": {
              "name": "marieshawn",
              "email": "abbott.shawn@versionone.com",
              "username": "marieshawn"
            },
            "added": [],
            "removed": [],
            "modified": ["README.md"]
          }],
          "repository": {
            "id": 23355501,
            "name": "CommitService.DemoRepo"
          }
        },
        wellFormedCommitsSample2: {
          "ref": "refs/heads/master",
          "commits": [{
            "id": "b42c285e1506edac965g92573a2121700fc92f8b",
            "distinct": true,
            "message": "S-11111 Updated Happy Path Validations!",
            "timestamp": "2014-10-03T15:57:14-03:00",
            "url": "https://github.com/kunzimariano/CommitService.DemoRepo/commit/b42c285e1506edac965g92573a2121700fc92f8b",
            "author": {
              "name": "shawnmarie",
              "email": "shawn.abbott@versionone.com",
              "username": "shawnmarie"
            },
            "committer": {
              "name": "shawnmarie",
              "email": "shawn.abbott@versionone.com",
              "username": "shawnmarie"
            },
            "added": [],
            "removed": [],
            "modified": ["README.md"]
          }],
          "repository": {
            "id": 23355501,
            "name": "CommitService.DemoRepo"
          }
        }
      }
    }
  };
}());