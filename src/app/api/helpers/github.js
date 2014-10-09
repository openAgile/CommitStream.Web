var github = require('octonode');
var es = require('./eventStore');
var uuid = require('uuid-v4');
var async = require('async');

function githubHelper() {
}

var asyncHelper = {
    ghrepo: null,
    getCommits: function (branch, callback) {
        var events = [];
        var parms = { sha: branch.name, page: 1, per_page: 100 };
        var ghrepo = this.ghrepo;
        
        async.whilst(
            function () { return parms.page != 0; },
            function (c) {
            ghrepo.commits(parms, function (err, body, headers) {
                if (body.length != 0) {
                    body.forEach(function (item) {
                        //TODO: do this on the translator
                        item.branch = parms.sha;
                        var event = {
                            eventId: uuid(),
                            eventType: 'github-event',
                            data: item
                        };
                        events.unshift(event);
                    });
                }
                
                if (body.length == 100) {
                    parms.page++;
                    console.log('Going to page ' + parms.page);
                    c();
                } else {
                    parms.page = 0;
                    console.log('Ready to push ' + events.length + ' events.');
                    es.pushEvents(JSON.stringify(events));
                    c();
                }
            });
        },
        callback
);
    }
};

githubHelper.prototype.getAllCommits = function (parms) {
    var client = github.client(parms.accessToken);
    var ghrepo = client.repo(parms.owner + '/' + parms.repo);
    asyncHelper.ghrepo = ghrepo;
    ghrepo.branches(function (e, b, h) {
        async.map(b, asyncHelper.getCommits.bind(asyncHelper), function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
            }
                    
        });
    });
};

module.exports = githubHelper;