(function (api) {
	api.init = function (app) {
		var controllers = [
			'import',
			'query',
			'settings',
			'digests/digests',
			'inboxes'
		];
		controllers.forEach(function(controllerPrefix) {
			var controller = require('./' + controllerPrefix + 'Controller');
			controller.init(app);
		});
	};
})(module.exports);