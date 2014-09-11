define(['moment'], function(moment) {
	var eventStoreQueryBaseUrl = 'http://jgough.corp.versionone.net:2113/streams/asset-',
			eventStoryQueryParameters = '/head/backward/5?embed=content',
			templateUrl = 'http://v1commitstream.azurewebsites.net/assetDetailCommits.html';
			
	return function(selector, assetNumber) {
    var commits = [];
    var eventStoryQueryUrl = eventStoryQueryBaseUrl + assetNumber + eventStoryQueryParameters;
    
    $.getJSON(eventStoreQueryUrl).done(function(events) {
      $.each(events.entries, function(index, value) {
        var e = value.content.data;
        var c = {
          timeFormatted: moment(e.commit.committer.date).fromNow(),
          author: e.commit.committer.name,
          sha1Partial: e.commit.tree.sha.substring(0,6),
          action: "committed",
          message: e.commit.message,
          commitHref: e.html_url
        };
        commits.push(c);
      });
      var data = {
        commits: commits
      };
      if (commits.length > 0) {
        $.get(templateUrl).done(function(source) {
          var template = Handlebars.compile(source);
          var content = template(data);
          $(selector).html(content);
        });
      }
    });
  }
});
