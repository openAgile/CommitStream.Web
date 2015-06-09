(function(healthController) {

  healthController.init = function(app) {
	app.get('/health', require('./healthGet'));
  };
}(module.exports));