define(['text!config.json', 'moment', 'handlebars'], function(config, moment, handlebars) {
    config = JSON.parse(config);
    var myHandlebars = handlebars.default;
    return function(selector, assetNumber) {
        var commits = [];
        var apiUrl = 'api/query?assetNumber=' + assetNumber;
        $.getJSON(apiUrl).done(function(data) {
            if (data.commits.length > 0) {
                $.get(config.assetDetailTemplateUrl).done(function(source) {
                    var template = myHandlebars.compile(source);
                    var content = template(data);
                    $(selector).html(content);
                });
            }
        });
    }
});