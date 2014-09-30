(function (api) {

	var importController = require("./importController"),
		queryController = require("./queryController");

	api.init = function (app) {
		importController.init(app);
		queryController.init(app);
	};
})(module.exports);