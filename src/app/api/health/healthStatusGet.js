(function() {
	module.exports = function(req, res) {
		var health = {'status': 'healthy'};
		res.json(health);
	};
}());