(function() {
  var commitsGet = require('../helpers/commitsGet'),
    cacheCreate = require('../helpers/cacheCreate');

  var cache = cacheCreate();

  module.exports = function(req, res) {
    var workitems = req.params.workitems;
    var instanceId = req.instance.instanceId;

    var buildUri = function(page) {
      return req.href('/api/' + instanceId + '/commits/tags/versionone/workitems/' + workitems + '?page=' + page);
    };

    // TODO: refactor when we support ad-hoc queries on multiple workitems...
    var stream = 'versionOne_CommitsWithWorkitems-' + instanceId + '_' + workitems;

    commitsGet(req.query, stream, buildUri, cache).then(function(commits) {
      // TODO use hal?
      res.send(commits);
    });
  };
}());