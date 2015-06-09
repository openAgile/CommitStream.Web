(function() {
	var eventStore = require('../helpers/eventStoreClient');
	var _ = require('underscore');

	module.exports = function(req, res) {
		
		eventStore
		.projections
		.getAsync()
		.then(function(response) {
			var eventStoreResponse = JSON.parse(response.body);

			var runningStatus = 'Running';

			var nonRunningProjections = _.filter(eventStoreResponse.projections, function(projection) {
				return projection.status !== runningStatus;
			})

			var projectionsStatus = {'status': 'healthy'};

			if(nonRunningProjections.length > 0) {
				projectionsStatus.status = 'errors';
				projectionsStatus = _.extend(projectionsStatus, {'projections': nonRunningProjections});
			}

			res.json(projectionsStatus);
		});

	};
}());