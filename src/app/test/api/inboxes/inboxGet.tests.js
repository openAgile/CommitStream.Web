require('../handler-base')();

// Things that proxyquire will use.

var eventStore = {
    queryStatePartitionById: sinon.stub()
  },
  inboxFormatAsHal = sinon.stub(),
  validateUUID = sinon.stub();

var handler = proxyquire('../../api/inboxes/inboxGet', {
  './inboxFormatAsHal': inboxFormatAsHal,
  '../validateUUID': validateUUID
});

function createRequest() {
  var request = httpMocks.createRequest({
    method: 'GET',
    url: '/api/inbox/fakeId',
    params: {
      instanceId: 'fakeInstanceId',
      inboxId: 'fakeInboxId'
    }
  });
  request.href = sinon.spy();
  request.instance = {
    instanceId: 'fakeInstanceId'
  };
  request.inbox = sinon.spy();
  return request;
}

function createResponse() {
  var response = httpMocks.createResponse();
  response.hal = sinon.spy();
  return response;
}

describe('inboxGet', function() {

  describe('when getting an inbox with it', function() {
    var inbox = sinon.spy(),
      formattedInbox = sinon.spy(),
      request,
      response;

    before(function() {
      inboxFormatAsHal.returns(formattedInbox);
      request = createRequest();
      response = createResponse();

      handler(request, response);
    });

    it('should call validateUUID with correct args', function() {
      validateUUID.should.have.been.calledWith('inbox', request.params.inboxId);
    });

    it('should call inboxFormatAsHal with correct args', function() {
      inboxFormatAsHal.should.have.been.calledWith(request.href, request.instance.instanceId, request.inbox);
    });

    it('should call res.hal with correct args', function() {
      response.hal.should.have.been.calledWith(formattedInbox);
    });

  });
});