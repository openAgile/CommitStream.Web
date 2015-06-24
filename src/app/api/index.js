(function (api) {
	api.init = function (app) {
		var controllers = [
			'digests/digests',
			'health/health',
			'import',
			'inboxes/inboxes',
			'query',
		];
		controllers.forEach(function(controllerPrefix) {
			var controller = require('./' + controllerPrefix + 'Controller');
			controller.init(app);
		});
	};
})(module.exports);
