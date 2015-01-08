(function (api) {

	var importController = require('./importController'),
		queryController = require('./queryController'),
		settingsController = require('./settingsController'),
		digestsController = require('./digestsController'),
		inboxesController = require('./inboxesController');

	api.init = function (app) {
		importController.init(app);
		queryController.init(app);
		settingsController.init(app);
		digestsController.init(app);
		inboxesController.init(app);
	};
})(module.exports);