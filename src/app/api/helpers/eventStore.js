
var request = require('request'),
    assert = require('assert'),
    config = require('../../config');

function eventStore(baseUrl, userName, password) {
  this.baseUrl = baseUrl;
  this.username = userName;
  this.password = password;

  this.authorization = 'Basic ' + new Buffer(this.username + ':' + this.password).toString('base64');
}

function decoratedOptions(options) {
  options = options || {};
  if (config.eventStoreAllowSelfSignedCert) {
    options.rejectUnauthorized = false;
  }
  return options;
}

eventStore.prototype.pushEvents = function (events, callback) {
  //TODO: review this approach
  //assert.ok(events, 'You must pass events');
  var eventStoreUrl = this.baseUrl + '/streams/github-events';

  var options = decoratedOptions({
    url: eventStoreUrl,
    body: events,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/vnd.eventstore.events+json',
      'Content-Length': events.length,
      'Authorization': this.authorization
    }
  });

  request.post(options, function (error, response, body) {
    callback(error, response, body);
  });
};

eventStore.prototype.pushEventsII = function (streamName, events, callback) {
  //TODO: review this approach
  //assert.ok(events, 'You must pass events');
  var eventStoreUrl = this.baseUrl + '/streams/' + streamName;

  var options = decoratedOptions({
    url: eventStoreUrl,
    body: events,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/vnd.eventstore.events+json',
      'Content-Length': events.length,
      'Authorization': this.authorization
    }
  });

  request.post(options, function (error, response, body) {
    callback(error, response, body);
  });
};

eventStore.prototype.getLastCommit = function (args, callback) {
  //TODO: review this approach
  assert.ok(args.owner && args.repo, 'You must specify an owner and a repo.');

  var eventStoreUrl = this.baseUrl + '/streams/repo-' + args.owner + '-' + args.repo + '/head?embed=content';

  var options = decoratedOptions({
    url: eventStoreUrl,
    headers: {
      'Accept': 'application/json',
      'Authorization': this.authorization
    }
  });

  request.get(options, function (error, response, body) {
    callback(error, response, body);
  });
};

eventStore.prototype.getLastAssets = function (args, callback) {
  //TODO: review this approach
  assert.ok(args.workitem, 'You must specify a workitem.');

  var eventStoreUrl = this.baseUrl +
    '/streams/asset-' +
    args.workitem +
    '/head/backward/' +
    args.pageSize +
    '?embed=content';

  var options = decoratedOptions({
    url: eventStoreUrl,
    headers: {
      'Accept': 'application/json',
      'Authorization': this.authorization
    }
  });

  request.get(options, function (error, response) {
    var events = [];
    if (response.body) {
      events = JSON.parse(response.body);
    }
    callback(error, events.entries || []);
  });
};

eventStore.prototype.createProjection = function (args, callback) {
  assert.ok(args.name && args.script, 'You must specify a name and a script.');

  var eventStoreUrl = this.baseUrl + '/projections/continuous?emit=yes&checkpoints=yes&enabled=yes&name=' + args.name;

  var options = decoratedOptions({
    url: eventStoreUrl,
    headers: {
      'Accept': 'application/json',
      'Authorization': this.authorization,
      'Content-Type': 'application/json;charset=utf-8',
      'Content-Length': args.script.length
    },
    body: args.script
  });

  request.post(options, function (err, response, body) {
    callback(err, response, body);
  });
};

eventStore.prototype.getProjections = function (callback) {
  var eventStoreUrl = this.baseUrl + '/projections/all-non-transient';

  var options = decoratedOptions({
    url: eventStoreUrl,
    headers: {
      'Accept': 'application/json',
      'Authorization': this.authorization
    }
  });

  request.get(options, function (err, response) {
    var result = {};
    if (response.body) {
      result = JSON.parse(response.body);
    }
    callback(err, result.projections || []);
  });
};

module.exports = eventStore;