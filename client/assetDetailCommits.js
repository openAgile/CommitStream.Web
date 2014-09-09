// TODO: remove hard coding:
var url = 'http://localhost:2113/streams/asset-S-12345/head/backward/5?embed=content';
var commits = [];
$.getJSON(url).done(function(events) {
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
    $.get("http://v1commitstream.azurewebsites.net/assetDetailCommits.html").done(function(source) {
      var template = Handlebars.compile(source);
      var content = template(data);
      $(CommitStreamPanel).html(content);
    });
  }
});
