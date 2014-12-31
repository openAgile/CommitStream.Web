(function(controller) {
  var config = require('../config'),
    gitHubEventsToApiResponse = require('./translators/gitHubEventsToApiResponse'),
    es = require('./helpers/eventStoreClient');
  _ = require('underscore'),
  uuid = require('uuid-v4'),
  Cache = require('ttl-cache');


  controller.init = function(app) {
    /**
     * @api {get} /api/query Request commits
     * @apiName query
     * @apiGroup Query
     *
     * @apiParam {String} workitem VersionOne workitem identifier
     *
     * @apiSuccess {String} firstname Firstname of the User.
     * @apiSuccess {String} lastname  Lastname of the User.
     * @apiSuccess {String}	commitDate Original commit date
     * @apiSuccess {String} timeFormatted Time the commit was made, relative to now
     * @apiSuccess {String} author Commit author's name
     * @apiSuccess {String}	sha1Partial First 6 characters of the commit's SHA1 hash
     * @apiSuccess {String} action The original action that produced the commit, such as "commited"
     * @apiSuccess {String} message Original commit message sent to the VCS
     * @apiSuccess {String} commitHref Link to an HTML page to view the commit in the source VCS
     */
    var cache = new Cache({
      ttl: 1800, // Number of seconds to keep entries
      interval: 60 // Cleaning interval
    });

    app.get("/api/query", function(req, res) {
      if (req.query.workitem) {

        var stream;
        if (req.query.workitem.toLowerCase() === 'all') {
          stream = 'github-events';
        } else {
          stream = 'asset-' + req.query.workitem;
        }

        function hasPageSize(query) {
          return _.has(query, "pageSize");
        }

        function getPageSize(query) {
          return query.pageSize;
        }

        function convertToInt(stringVal) {
          if (!isNaN(stringVal))
            return parseInt(stringVal);
          else
            return NaN;
        }

        function getDefaultWhenNaN(value, defaultValue) {
          if (_.isNaN(value)) {
            return defaultValue;
          } else
            return value;
        }

        function getConvertedPageSizeOrDefault(query) {
          var defaultSize = 25;
          if (!hasPageSize(query)) return defaultSize;
          var convertedSize = convertToInt(getPageSize(query));
          return getDefaultWhenNaN(convertedSize, defaultSize);
        }

        var pageSize = getConvertedPageSizeOrDefault(req.query);

        var page = cache.get(req.query.page);

        es.streams.get({
          name: stream,
          count: pageSize,
          pageUrl: page
        }, function(error, response) {
          var result = {
            commits: []
          }

          if (response.body) {
            var obj = JSON.parse(response.body);
            var links = obj.links;
            var guiNextId = uuid();
            result = gitHubEventsToApiResponse(obj.entries);
            //TODO: check all of them, not just the third one
            if (links[3].relation == 'next') {
              cache.set(guiNextId, links[3].uri);
              var nextUri = config.serverBaseUrl + '/api/query?key=' + req.query.key + '&workitem=' + req.query.workitem + '&page=' + guiNextId;
              res.set("Next-Page", nextUri);
            }
          }

          res.set("Content-Type", "application/json");
          res.send(result);
        });
      } else {
        res.set("Content-Type", "application/json");
        res.status(400).send({
          error: 'Parameter workitem is required'
        });
      }
    });
  };
})(module.exports);