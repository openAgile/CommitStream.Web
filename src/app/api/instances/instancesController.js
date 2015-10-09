(function(instancesController) {
  instancesController.init = function(app) {
    app.post('/api/instances', require('./instanceCreate'));
    app.get('/api/instances/:instanceId', require('./instanceGet'));
    app.get('/api/:instanceId/commits/tags/versionone/workitem', require('./instanceCommitsGet'));
  };
}(module.exports));