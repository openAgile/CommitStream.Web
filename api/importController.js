//importController
(function (importController) {

	var helpers = require ("./helpers");

	importController.init = function (app) {
		app.get("/api/continuingImporting", function (req, res) {

			var urlRepo = "/repos/" + req.query.owner + "/" + req.query.repo;			

			var options = {
			  host: 'weventstore.cloudapp.net',
			  port:  '2113',
			  path: '/streams/github-events/head?embed=content',
			  headers: { 'Accept': 'application/json' }
			};
			helpers.getHttpResources(options, function(err, response) {
				var date = response.commit.committer.date;
				var commistUrl = urlRepo + "/commits?since=" + date;
				var optionsHttps = {
				  host: 'api.github.com',
				  path: commistUrl,
				  headers: { "User-Agent": "test" }
				};
				helpers.getHttpsResources(optionsHttps, function(err, response) {
					res.set("Content-Type","application/json");
					res.send(response);
				});
			});
			
		});
	};
})(module.exports);