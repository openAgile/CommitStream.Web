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
				sha1Partial: e.commit.sha.substring(0, 6),
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
		/**
		 * @api {get} /api/query Request commits
		 * @apiName query
		 * @apiGroup Query
		 *
		 * @apiParam {String} workitem VersionOne workitem identifier
		 *
		 * @apiSuccess {String} firstname Firstname of the User.
		 * @apiSuccess {String} lastname  Lastname of the User.
		 * @apiSuccess {String}	commitDate Original commit date
		 * @apiSuccess {String} timeFormatted Time the commit was made, relative to now
		 * @apiSuccess {String} author Commit author's name
		 * @apiSuccess {String}	sha1Partial First 6 characters of the commit's SHA1 hash
		 * @apiSuccess {String} action The original action that produced the commit, such as "commited"
		 * @apiSuccess {String} message Original commit message sent to the VCS
		 * @apiSuccess {String} commitHref Link to an HTML page to view the commit in the source VCS
		 */		
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
