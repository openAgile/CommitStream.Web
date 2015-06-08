(function(healthController) {

  healthController.init = function(app) {
  	app.get('/api/:instanceId/health', require('./healthGet'));
  };
}(module.exports));