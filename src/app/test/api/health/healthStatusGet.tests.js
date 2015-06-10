require('../handler-base')();
var healthStatusGet = require('../../../api/health/healthStatusGet');

describe('healthStatusGet', function() {

	var response, request;
	var healthyStatus = {'status': 'healthy'};

	before(function() {
		response = httpMocks.createResponse();
		response.json = sinon.spy();

		request = httpMocks.createRequest({
			method: 'GET',
			url: '/api/health/status'
		});

		healthStatusGet(request, response);
	})

	it('should call res.hal with correct args', function() {
      response.json.should.have.been.calledWith(healthyStatus);
    });

})