(function (api) {

	var importController = require("./importController"),
		queryController = require("./queryController"),
		settingsController = require("./settingsController"),
		digestsController = require("./digestsController");

	api.init = function (app) {
		importController.init(app);
		queryController.init(app);
		settingsController.init(app);
		digestsController.init(app);
	};
})(module.exports);