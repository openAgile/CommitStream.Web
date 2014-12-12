//TODO: singleton
var github = require('octonode'),
  uuid = require('uuid-v4'),
  config = require('../../config'),
  assert = require('assert');

var githubHelper = function() {};

function Helper(repoClient) {
  this.events = [];
  this.parms = {
    sha: '',
    page: 1,
    per_page: 100
  };
  this.ghrepo = repoClient;

  this.getCommits = function getCommitsRec(args, callback) {
    var that = this;
    if (args.context) {
      that = args.context;
    }
    that.parms.sha = args.branchName;

    that.ghrepo.commits(that.parms, function(err, body, headers) {
      if (body.length != 0) {
        body.forEach(function(item) {
          //TODO: do this in the translator
          item.branch = that.parms.sha;
          var event = {
            eventId: uuid(),
            eventType: 'github-event',
            data: item
          };
          that.events.unshift(event);
        });
      }

      if (body.length == 100) {
        that.parms.page++;
        console.log('Going to page ' + that.parms.page);
        getCommitsRec({
          branchName: that.parms.sha,
          context: that
        }, callback);
      } else {
        callback(that.events);
      }
    });
  }
};

githubHelper.prototype.getAllCommits = function(args, callback) {
  assert.ok(args.accessToken && args.owner && args.repo, 'You must specify accesToken, owner and repo');

  var client = github.client(args.accessToken);
  var ghrepo = client.repo(args.owner + '/' + args.repo);

  ghrepo.branches(function(e, b, h) {
    if (e) throw e;
    b.forEach(function(entry) {
      var helper = new Helper(ghrepo);
      helper.getCommits({
        branchName: entry.name
      }, callback);
    });
  });
};

module.exports = githubHelper;