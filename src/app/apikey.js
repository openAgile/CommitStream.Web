(function(module) {
	var config = require('./config');

	module.exports = function (req, res, next) {
    	if (!config.apiKey || (!req.query.key || !req.query.key == config.apiKey)) {
        	res.status(401).send('API key parameter missing or invalid');
    	} else {
        	return next();
    	}
    }
})(module);
