(function (bootstrapper) {
  bootstrapper.boot = function (config) {
    var _ = require('underscore'),
        eventStore = require('./api/helpers/eventStore');
    
    var es = new eventStore(config.eventStoreBaseUrl, config.eventStoreUser, config.eventStorePassword);
    
    es.getProjections(function (error, response, body) {
      createProjections(body.projections);
    });
    
    function createProjections(projectionsFound) {
      var fs = require('fs');
      var dir = './projections/';
      
      console.log('Looking for projections...');
      fs.readdir(dir, function (err, files) {
        if (err) throw err;
        files.forEach(function (name) {
          fs.readFile(dir + name, 'utf-8', function (err, script) {
            if (err) throw err;
            else {
              if (!_.findWhere(projectionsFound, { effectiveName: name })) {
                es.createProjection({ name: name, script: script }, function (error, response, body) {
                  if (error) {
                    console.error('ERROR could not create projection ' + name + ':');
                    console.error(error);
                  }
                  else {
                    console.log('OK created projection ' + name);
                    console.log(body);
                  }
                });
              } else {
                console.log('OK found ' + name);
              }
            }
          });
        });
      });
    }
  }
})(module.exports);