(function() {
	var _ = require('underscore'),
		moment = require('moment');

	module.exports = function(entries) {
		var commits = _.map(entries, function(entry) {
			var e = entry.content.data;
			return {
				commitDate: e.commit.committer.date,
				timeFormatted: moment(e.commit.committer.date).fromNow(),
				author: e.commit.committer.name,
				sha1Partial: e.sha.substring(0, 6),
				action: "committed",
				message: e.commit.message,
				commitHref: e.html_url
			};
		});
		var response = {
			commits: commits
		};
		return response;
	};
})();