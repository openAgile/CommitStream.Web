(function() {
	var _ = require('underscore'),
        moment = require('moment');
    
    var getRepoOwnerName = function (commit) {        
        var repoArray = commit.html_url.split('/commit')[0].split('/');
        return result = {
                repoName: repoArray.pop(),
                repoOwner: repoArray.pop()
        }       
    };

	module.exports = function(entries) {
		var commits = _.map(entries, function(entry) {
            var e = entry.content.data;
            var repo = getRepoOwnerName(e);
            return {
                commitDate: e.commit.committer.date,
                timeFormatted: moment(e.commit.committer.date).fromNow(),
                author: e.commit.committer.name,
                sha1Partial: e.sha.substring(0, 6),
                action: "committed",
                message: e.commit.message,
                commitHref: e.html_url,
                repo: repo.repoOwner + '/' + repo.repoName,
                branch: e.branch,
                branchHref: "https://github.com/" + repo.repoOwner + "/" + repo.repoName + "/tree/" + e.branch,
                repoHref: "https://github.com/" + repo.repoOwner + "/" + repo.repoName
			};
		});
		console.log("commits:");
		console.log(commits);
		var response = {
			commits: commits
		};
		return response;
	};
})();