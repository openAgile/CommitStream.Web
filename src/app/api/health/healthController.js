(function(healthController) {

  healthController.init = function(app) {
	app.get('/health/status', require('./healthStatusGet'));
	app.get('/health/projections', require('./healthStatusProjectionsGet'));
  };
}(module.exports));