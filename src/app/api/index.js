(function (api) {

	var importController = require("./importController"),
		queryController = require("./queryController"),
		settingsController = require("./settingsController"),
		digestController = require("./digestController");

	api.init = function (app) {
		importController.init(app);
		queryController.init(app);
		settingsController.init(app);
		digestController.init(app);
	};
})(module.exports);