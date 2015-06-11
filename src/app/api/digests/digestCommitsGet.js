(function() {
  var commitsGet = require('../helpers/commitsGet'),
    cacheCreate = require('../helpers/cacheCreate');

  var cache = cacheCreate();

  module.exports = function(req, res) {
    // TODO: validate digestId ?
    var digestId = req.params.digestId;
    var instanceId = req.instance.instanceId;

    var buildUri = function(page) {
      return req.href('/api/' + instanceId + '/digests/' + digestId + 
        '/commits?page=' + page + '&apiKey=' + req.instance.apiKey);
    };

    var stream = 'digestCommits-' + digestId;

    commitsGet(req.query, stream, buildUri, cache).then(function(commits) {
      // TODO use hal?
      res.send(commits);
    });
  };
}());