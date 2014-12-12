(function(bootstrapper) {
  bootstrapper.boot = function(config) {
    var _ = require('underscore'),
      path = require('path'),
      fs = require('fs'),
      EventStore = require('eventstore-client');

    var es = new EventStore({
      baseUrl: config.eventStoreBaseUrl,
      username: config.eventStoreUser,
      password: config.eventStorePassword
    });

    console.log('Looking for already existing projections...');
    es.projections.get(function(error, response) {
      initProjections(JSON.parse(response.body));
    });

    function initProjections(existingProjections) {
      console.log('Looking for new projections...');
      getLocalProjections(function(item) {
        if (!_.findWhere(existingProjections.projections, {
          effectiveName: item.name
        })) {
          createProjection(item)
        } else {
          console.log('OK found ' + item.name);
        }
      });
    };

    function getLocalProjections(cb) {
      var projections = [];
      var dir = path.join(__dirname, 'projections');
      console.log(dir);
      fs.readdir(dir, function(err, files) {
        files.forEach(function(name) {
          var fullPath = path.join(dir, name);
          fs.readFile(fullPath, 'utf-8', function(err, script) {
            cb({
              name: name.slice(0, -3),
              projection: script
            });
          });
        });
      });
    };

    function createProjection(projectionObject) {
      es.projections.post(projectionObject, function(error, response) {
        if (error) {
          console.error('ERROR could not create projection ' + projectionObject.name + ':');
          console.error(error);
        } else {
          console.log('OK created projection ' + projectionObject.name);
          console.log(response.body);
        }
      });
    };
  }
})(module.exports);