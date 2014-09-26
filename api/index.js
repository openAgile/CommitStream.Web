(function (api) {

	var importController = require("./importController");

	api.init = function (app) {
		importController.init(app);
	};
})(module.exports);