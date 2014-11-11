(function (githubTranslator) {
    var _ = require('underscore'),
       uuid = require('uuid-v4');

    githubTranslator.translatePush = function (pushEvent) {
        var branch = pushEvent.ref.split('/').pop();
        var repository = {
            id: pushEvent.repository.id,
            name: pushEvent.repository.name
        };
        var events = _.map(pushEvent.commits, function (aCommit) {            
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
                branch: branch
            };
            return {
                eventId: uuid(),
                eventType: 'github-event',
                data: commit
            };            
        });
        return events;
    };    
})(module.exports);