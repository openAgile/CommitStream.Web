(function (api) {

	var importController = require("./importController"),
		queryController = require("./queryController"),
		settingsController = require("./settingsController");

	api.init = function (app) {
		importController.init(app);
		queryController.init(app);
		settingsController.init(app);
	};
})(module.exports);