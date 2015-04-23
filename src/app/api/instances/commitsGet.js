(function() {
  var config = require('../../config'),
    _ = require('underscore'),
    gitHubEventsToApiResponse = require('../translators/gitHubEventsToApiResponse'),
    eventStore = require('../helpers/eventStoreClient'),
    pager = require('../helpers/pager'),
    Cache = require('ttl-cache');

  var cache = new Cache({
    ttl: 120, // Number of seconds to keep entries
    interval: 60 // Cleaning interval
  });

  module.exports = function(req, res) {
    var workitems = req.params.workitems;
    var instanceId = req.instance.instanceId;
    // TODO validate differently
    if (!workitems) throw new Error('Parameter workitems is required');
    
    var buildUri = function(page) {
      return req.href('/api/' + instanceId + '/commits/tags/versionone/workitems/' + workitems + '?page=' + page);
    };

    // TODO: refactor when we support ad-hoc queries on multiple workitems...
    var stream = 'versionOne_CommitsWithWorkitems-' + instanceId + '_' + workitems;
    var pageSize = pager.getPageSize(req.query);
    var currentPage = cache.get(req.query.page);

    var args = {
      name: stream,
      count: pageSize,
      pageUrl: currentPage,
      embed: 'tryharder'
    };

    eventStore.getFromStream(args)
      .then(function(response) {        
        var links = response.links;       
        var apiResponse = gitHubEventsToApiResponse(response.entries);
        var pagedResponse = pager.getPagedResponse(apiResponse, links, currentPage, buildUri, cache);
        // TODO res.hal?
        res.json(pagedResponse);
      }).catch(function(error) {
        console.error('CAUGHT ERROR');
        console.log(error);
        // TODO do this better? With res.hal?
        res.json({
          commits: [],
          _links: {}
        });
      });
  };
}());

/*
          var result = {
            commits: [],
            _links: {}
          }

          if (response && response.body) {
            var obj = JSON.parse(response.body);

            var links = obj.links;
            var guid = uuid();
            result = gitHubEventsToApiResponse(obj.entries);
            //TODO: check all of them, not just the third one
            if (links[3].relation == 'next') {
              cache.set(guid, links[3].uri);
              var next = buildUri(protocol, host, guid, req.query);
              var previous = buildUri(protocol, host, req.query.page, req.query);
              result._links = {
                next: next
              };
            }
          } else if (response && response.statusCode === 408) {
            return res.sendGenericError('GET /api/query.get: response && response.statusCode === 408');
          }
          res.set("Content-Type", "application/json");
          res.send(result);
        });
      }
    });
  };
})(module.exports);
*/