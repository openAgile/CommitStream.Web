define(['text!config.json', 'moment', 'handlebars'], function(config, moment, handlebars) {
    config = JSON.parse(config);
    var myHandlebars = handlebars.default;
    return function(selector, assetNumber) {
        var commits = [];
        var apiUrl = config.eventStoreAssetStreamUrl
            + assetNumber
            + config.eventStoreAssetQueryParams;

        $.getJSON(apiUrl).done(function(events) {
            $.each(events.entries, function(index, value) {
                var e = value.content.data;
                var c = {
                    timeFormatted: moment(e.commit.committer.date).fromNow(),
                    author: e.commit.committer.name,
                    sha1Partial: e.commit.tree.sha.substring(0, 6),
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
                $.get(config.assetDetailTemplateUrl).done(function(source) {
                    var template = myHandlebars.compile(source);
                    var content = template(data);
                    $(selector).html(content);
                });
            }
        });
    }
});