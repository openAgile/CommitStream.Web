
//TODO: remove completely?
var request = require('request');
var reqJson = require('request-json');

function eventStore(baseUrl, userName, password) {
  this.baseUrl = baseUrl;
  this.username = userName;
  this.password = password;
  
  this.authorization = 'Basic ' + new Buffer(this.username + ':' + this.password).toString('base64');
}

//TODO: add callback
eventStore.prototype.pushEvents = function (events) {
  var eventStoreUrl = this.baseUrl + '/streams/github-events';
  
  var options = {
    url: eventStoreUrl,
    body: events,
    headers: {
      'Accept': 'application/json',
      'Content-Type': "application/vnd.eventstore.events+json",
      'Content-Length': events.length,
      'Authorization': this.authorization
    }
  };
  
  request.post(options, function (error, response, body) {
    if (error) {
      console.log(error);
    } else {
      console.log('Posted to eventstore.');
      console.log(response.statusCode);
    }
  });
        
};

eventStore.prototype.getLastCommit = function (owner, repo, callback) {
  var eventStoreUrl = this.baseUrl + '/streams/repo-' + owner + '-' + repo + '/head?embed=content';
  
  var options = {
    url: eventStoreUrl,            
    headers: {
      'Accept': 'application/json'
    }
  };
  request.get(options, function (error, response, body) {
    console.log('Getting the last commit for this repository');
    if (response.statusCode == 404) {
      callback('Stream not found, You need to do a full import', null);
    }
    if (response.statusCode == 200) {
      callback(null, body);
    }
  });
};

eventStore.prototype.getLastAssets = function (options, callback) {
  
  var path = '/streams/asset-' + 
    options.workitem +
    '/head/backward/' +
    options.pageSize +
    '?embed=content';
  
  var client = reqJson.newClient(this.baseUrl);
  client.get(path, function (err, response, body) {
    callback(err, body.entries);
  });

};

eventStore.prototype.createProjection = function (name, script) {
  var eventStoreUrl = this.baseUrl + '/projections/continuous?emit=yes&checkpoints=yes&enabled=yes&name=' + name;
  
  var options = {
    url: eventStoreUrl,            
    headers: {
      'Accept': 'application/json',
      'Authorization': this.authorization,
      'Content-Type': 'application/json;charset=utf-8',
      'Content-Length': script.length
    },
    body: script
  };
  
  request.post(options, function (err, response, body) {
    if (err) {
      console.error('ERROR could not create projection ' + name + ':');
      console.error(err);
    }
    else {
      console.log('OK created projection ' + name);
      console.log(body);
    }
  });

};

eventStore.prototype.getProjections = function (callback) {
  var client = reqJson.newClient(this.baseUrl);
  client.get('/projections/all-non-transient', function (err, response, body) {
    callback(err, response, body);
  });
};

module.exports = eventStore;