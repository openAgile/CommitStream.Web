require('../handler-base')();

var instanceFormatAsHal = sinon.stub();

var handler = proxyquire('../../api/instances/instanceGet', {
  './instanceFormatAsHal': instanceFormatAsHal
});

function createRequest() {
  var request = httpMocks.createRequest({
    method: 'GET',
    url: '/api/instances/fakeId'
  });
  request.href = sinon.spy();
  request.instance = sinon.spy();
  return request;
}

function createResponse() {
  var response = httpMocks.createResponse();
  // Set up default mocks
  response.hal = sinon.spy();
  return response;
}

describe('instanceGet', function() {

  describe('when getting an instance with a valid instanceId it', function() {
    var formattedInstance = sinon.spy(),
      request,
      response;

    before(function() {
      instanceFormatAsHal.returns(formattedInstance);
      request = createRequest();
      response = createResponse();

      handler(request, response);
    });

    it('should call instanceFormatAsHal with correct args', function() {
      instanceFormatAsHal.should.have.been.calledWith(request.href, request.instance);
    });

    it('should call res.hal with correct args', function() {
      response.hal.should.have.been.calledWith(formattedInstance);
    });

  });
});