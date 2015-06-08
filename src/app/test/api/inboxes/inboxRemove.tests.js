require('../handler-base')();

var inboxRemoved = {
    create: sinon.stub()
  },
  eventStore = {
    queryStatePartitionById: sinon.stub(),
    postToStream: sinon.stub()
  };

var handler = proxyquire('../../api/inboxes/inboxRemove', {
  './inboxRemoved': inboxRemoved,
  '../helpers/eventStoreClient': eventStore
});

describe('inboxRemove', function() {

  describe('when removing an inbox it', function() {
    var instanceId = '44444444-4444-4444-4444-444444444444',
      digestId = '22222222-2222-4222-2222-222222222222',
      inboxId = '33333333-3333-4333-3333-333333333333',
      inbox,
      inboxRemovedEvent,
      request,
      response;

    before(function() {

      inbox = {
        digestId: sinon.spy()
      };

      eventStore.queryStatePartitionById.resolves(inbox);

      inboxRemovedEvent = {
        data: sinon.spy()
      };

      inboxRemoved.create.returns(inboxRemovedEvent);

      eventStore.postToStream.resolves();

      request = httpMocks.createRequest({
        params: {
          instanceId: instanceId,
          inboxId: inboxId
        }
      });

      request.instance = {
        instanceId: instanceId
      };

      request.inbox = {
        digestId: digestId
      };

      response = httpMocks.createResponse();

      var resBody = {
        instanceId: instanceId,
        inboxId: inboxId,
        message: 'Your inbox has been successfully removed..'
      };

      response.status = sinon.stub().returns({
        json: sinon.stub().returns(resBody)
      });

      handler(request, response);

    });

    it('should call inboxRemoved.create with correct args', function() {
      inboxRemoved.create.should.have.been.calledWith('44444444-4444-4444-4444-444444444444', '22222222-2222-4222-2222-222222222222', '33333333-3333-4333-3333-333333333333');
    });

    it('should call eventStore.postToStream with correct args', function() {
      eventStore.postToStream.should.have.been.calledWith({
        name: 'inboxes-44444444-4444-4444-4444-444444444444',
        events: inboxRemovedEvent
      });
    });

    it('should call res.status with correct args', function() {
      response.status.should.have.been.calledWith(200);
    });

    it('should call res.status(200).json() with correct args', function() {
      response.status(200).json.should.have.been.calledWith({
        message: 'The inbox 33333333-3333-4333-3333-333333333333 has been removed from instance 44444444-4444-4444-4444-444444444444.'
      });
    });

  });

});