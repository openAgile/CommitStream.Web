require('../handler-base')();

var eventStore = {
    getFromStream: sinon.stub()
  },
  digestsFormatAsHal = sinon.stub(),
  csError = {
    StreamNotFound: sinon.stub()
  }

// Configure up the controller use proxyquire
var handler = proxyquire('../../api/digests/digestsGet', {
  './digestsFormatAsHal': digestsFormatAsHal,
  '../helpers/eventStoreClient': eventStore,
  '../../middleware/csError': csError
});

describe('digestsGet', function() {
  var instanceId = '872512eb-0d42-41fa-9a4e-fcb480ef265f',
    args,
    formattedDigests,
    digests,
    request,
    response;

  describe('when getting the list of digests for an instance', function() {

    before(function() {
      args = {
        name: 'digests-' + instanceId
      };
      digests = {
        entries: []
      };
      formattedDigests = {};
      digestsFormatAsHal.returns(formattedDigests);
      eventStore.getFromStream.resolves(digests);

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/api/' + instanceId + '/digests'
      });

      response = httpMocks.createResponse();

      // Set up mocks
      request.instance = {
        instanceId: instanceId
      };
      request.href = sinon.spy();
      response.hal = sinon.spy();

      handler(request, response);
    });

    it('should call eventStore.getFromStream with correct args', function() {
      eventStore.getFromStream.should.have.been.calledWith(args)
    });

    it('should call digestsFormatAsHal once', function() {
      digestsFormatAsHal.should.have.been.calledOnce;
    });

    it('should call digestsFormatAsHal with correct args', function() {
      digestsFormatAsHal.should.have.been.calledWith(request.href, instanceId, digests.entries);
    });

    it('should call res.hal with correct args', function() {
      response.hal.should.have.been.calledWith(formattedDigests);
    });

    it('should call res.hal once', function() {
      response.hal.should.have.been.calledOnce;
    });

  });

  describe('when there are no digests', function() {
    //TODO: find out how to test this
  });

});