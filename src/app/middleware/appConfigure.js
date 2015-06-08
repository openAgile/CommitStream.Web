(function() {
	var sendGenericError = require('./sendGenericError'),
		href = require('./resHref'),
		hal = require('./resHal');

	module.exports = function(app) {
		app.use(sendGenericError);
		app.use(href);
		app.use(hal);
		return app;
	};
}())