(function(instancesController) {
  instancesController.init = function(app) {
    app.post('/api/instances', require('./instanceCreate'));
    app.get('/api/instances/:instanceId', require('./instanceGet'));
    app.get('/api/:instanceId/commits/tags/versionone/workitems/:workitems', require('./instanceCommitsGet'));
  };
}(module.exports));