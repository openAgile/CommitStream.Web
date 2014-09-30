(function (controller) {
	var helpers = require("./helpers"),
		config = require("../config"),
		moment = require("moment"),
		_ = require("underscore");

	function githubCommitEventsTranslateFromEventStore(entries) {
		var commits = _.map(entries, function(entry) {
			var e = entry.content.data;
			return {
				commitDate: e.commit.committer.date,
				timeFormatted: moment(e.commit.committer.date).fromNow(),
				author: e.commit.committer.name,
				sha1Partial: e.commit.tree.sha.substring(0, 6),
				action: "committed",
				message: e.commit.message,
				commitHref: e.html_url
		    };
	    });
	    var response = {
	        commits: commits
	    };
	    return response;
	}

	controller.init = function (app) {
		app.get("/api/query", function (req, res) {
			var options = {
				host: config.eventStoreHost,
				port: config.eventStorePort,
				path: '/streams/asset-' + req.query.workitem + '/head/backward/5?embed=content',
				headers: { 'Accept': 'application/json' }
			};
			helpers.getHttpResources(options, function(err, response) {
				res.set("Content-Type","application/json");
				var commits = githubCommitEventsTranslateFromEventStore(response.entries);
				res.send(commits);
			});
		});
	};
})(module.exports);