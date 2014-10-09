(function (controller) {
	var helpers = require('./helpers'),
		config = require('../config'),
		gitHubEventsToApiResponse = require('./translators/gitHubEventsToApiResponse');
		
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
				var commits = gitHubEventsToApiResponse(response.entries);
				res.send(commits);
			});
		});
	};
})(module.exports);
