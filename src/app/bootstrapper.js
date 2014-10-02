(function(bootstrapper) {
  bootstrapper.boot = function(config) {
    var helpers = require ('./api/helpers'),
        _ = require('underscore'),
        request = require('request');

    var options = {
      host: config.eventStoreHost,
      port: config.eventStorePort,
      path: '/projections/all-non-transient'
    };
    
    helpers.getHttpResources(options, function(err, response) {
      createProjections(response.projections);
    });

    function createProjections(projectionsFound) {
      var fs = require('fs');
      var dir = './projections/';

      console.log('Looking for projections...');
      fs.readdir(dir,function(err,files){
        if (err) throw err;
        files.forEach(function(name){
          fs.readFile(dir + name,'utf-8',function(err, script){
            if (err) throw err;
            else {
              if (!_.findWhere(projectionsFound, {effectiveName:name})) {
                createProjection(name, script);
              } else {
                console.log('OK found ' + name);
              }
            }
          });
        });
      });
    }

    function createProjection(name, script) {
      var options = {
        url: 'http://admin:changeit@' + config.eventStoreHost + ':' 
          + config.eventStorePort + '/projections/continuous?emit=yes&checkpoints=yes&enabled=yes&name=' + name,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
          'Content-Length': script.length
        }
      };
      request.post(options, function(err, response, body) {
        if (err) { 
          console.error('ERROR could not create projection ' + name + ':');
          console.error(err);
        }
        else {
          console.log('OK created projection ' + name);
          console.log(body);
        }
      });
    }
  }
})(module.exports);