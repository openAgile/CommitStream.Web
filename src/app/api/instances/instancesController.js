(function(instancesController) {
  instancesController.init = function(app) {
    app.post('/api/instances', require('./instanceCreate'));
    app.get('/api/instances/:instanceId', require('./instanceGet'));
  };
}(module.exports));
