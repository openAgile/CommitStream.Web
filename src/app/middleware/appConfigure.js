(function() {
	var sendGenericError = require('./sendGenericError');
	module.exports = function(app) {
		app.use(sendGenericError);
		return app;
	};
}())