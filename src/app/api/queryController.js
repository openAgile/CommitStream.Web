(function(controller) {
  var config = require('../config'),
    gitHubEventsToApiResponse = require('./translators/commitEventsToApiResponse'),
    es = require('./helpers/eventStoreClient'),
    _ = require('underscore'),
    uuid = require('uuid-v4'),
    Cache = require('ttl-cache');

  function buildUri(protocol, host, guid, parms) {
    return protocol + '://' + host + '/api/query?key=' + parms.key + '&workitem=' + parms.workitem + '&page=' + guid;
  }


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
      ttl: 120, // Number of seconds to keep entries
      interval: 60 // Cleaning interval
    });

    app.get("/api/query", function(req, res) {

      // NOTE: Was going to pull the usage of protocol and host out of here
      //       and use our urls module, but we have been talking about pulling this
      //       controller apart and placing the resposibilities into other controllers
      //       so rather than refactor it, I decided to just wait until that work happens.
      var protocol = config.protocol || req.protocol;
      var host = req.get('host');

      if (req.query.workitem) {

        var stream;
        if (req.query.workitem.toLowerCase() === 'all') {
          stream = 'digestCommits-' + req.query.digestId;
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
          pageUrl: page,
          embed: 'tryharder'
        }, function(error, response) {
          if (error) {
            return res.sendGenericError(error);
          }

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
      } else {
        res.set("Content-Type", "application/json");
        res.status(400).send({
          error: "Parameter workitem is required"
        });
      }
    });
  };
})(module.exports);
