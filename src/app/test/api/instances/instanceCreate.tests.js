require('../handler-base')();

// Things that proxyquire will use.

var instanceAdded = {
    create: sinon.stub()
  },
  eventStore = {
    postToStream: sinon.stub().resolves()
  },
  instanceFormatAsHal = sinon.stub();

// Configure up the controller use proxyquire
var handler = proxyquire('../../api/instances/instanceCreate', {
  '../events/instanceAdded': instanceAdded,
  './instanceFormatAsHal': instanceFormatAsHal,
  '../helpers/eventStoreClient': eventStore
});

describe('instanceCreate', function() {

  describe('when creating an instance it', function() {
    var args,
        instanceAddedEvent,
        formattedInstance,
        request,
        response;

    before(function() {
      instanceAddedEvent = {
        data: {}
      };
      
      instanceAdded.create.returns(instanceAddedEvent);

      args = {
        name: 'instances',
        events: instanceAddedEvent
      };

      formattedInstance = {};
      instanceFormatAsHal.returns(formattedInstance);

      var request  = httpMocks.createRequest({
        method: 'POST',
        url: '/api/instances'
      });

      response = httpMocks.createResponse();

      // Set up mocks
      request.href = sinon.spy();
      response.hal = sinon.spy();

      handler(request, response);
    });

    it('should call instanceAdded.create once to create an event', function() {
      instanceAdded.create.should.have.been.calledOnce;
    });

    it('should call instanceAdded.create without any args', function() {
      instanceAdded.create.should.have.been.calledWith();
    });

    it('should call eventStore.postToStream with correct args', function() {
      eventStore.postToStream.should.have.been.calledWith(args)
    });

    it('should call instanceFormatAsHal once', function() {
      instanceFormatAsHal.should.have.been.calledOnce;
    });

    it('should call instanceFormatAsHal with correct args', function() {
      instanceFormatAsHal.should.have.been.calledWith(sinon.match.func, instanceAddedEvent.data);
    });

    it('should call res.hal with correct args', function() {
      response.hal.should.have.been.calledWith(formattedInstance, 201);
    });

    it('should call res.hal once', function() {
      response.hal.should.have.been.calledOnce;
    });

  });

});