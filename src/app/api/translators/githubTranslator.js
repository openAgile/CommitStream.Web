
  githubTranslator.translatePush = function(pushEvent, digestId) {
    var branch = pushEvent.ref.split('/').pop();
    var repository = {
      id: pushEvent.repository.id,
      name: pushEvent.repository.name
    };
    var events = _.map(pushEvent.commits, function(aCommit) {
      var commit = {
        sha: aCommit.id,
        commit: {
          author: aCommit.author,
          committer: {
            name: aCommit.committer.name,
            email: aCommit.committer.email,
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
        eventType: 'GitHubCommitReceived',
        data: commit,
        metadata: {
          digestId: digestId
        }
      };
    });
    return events;
  };
})(module.exports);
