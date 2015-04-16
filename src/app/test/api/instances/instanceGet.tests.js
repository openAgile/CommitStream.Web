require('../handler-base')();

// Things that proxyquire will use.

var eventStore = {
    queryStatePartitionById: sinon.stub()
  },
  instanceFormatAsHal = sinon.stub(),
  validator = {
    isUUID: sinon.stub()
  };

// Configure up the controller use proxyquire
var handler = proxyquire('../../api/instances/instanceGet', {
  './instanceFormatAsHal': instanceFormatAsHal,
  '../helpers/eventStoreClient': eventStore,
  'validator': validator
});

function createRequest() {
  var request = httpMocks.createRequest({
      method: 'GET',
      url: '/api/instances/fakeId',
      params: {
        instanceId: 'fakeId'
      }
    });
  request.href = sinon.spy();
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
    var instance = {},
        formattedInstance = {},
        request,
        response;    

    before(function() {
      validator.isUUID.returns(true);
      eventStore.queryStatePartitionById.resolves(instance);
      instanceFormatAsHal.returns(formattedInstance);
      request = createRequest();
      response = createResponse();

      handler(request, response);
    });

    it('should call validator.isUUID once', function() {
      validator.isUUID.should.have.been.calledOnce;
    });
    
    it('should call validator.isUUID with correct args', function() {
      validator.isUUID.should.have.been.calledWith(request.params.instanceId);
    });

    it('should call eventStore.queryStatePartitionById once', function() {
      validator.isUUID.should.have.been.calledOnce;
    });

    it('should call eventStore.queryStatePartitionById with correct args', function() {
      var args = { 
        name: 'instance',
        id: request.params.instanceId
      };
      eventStore.queryStatePartitionById.should.have.been.calledWith(args);
    });

    it('should call instanceFormatAsHal once', function() {
      instanceFormatAsHal.should.have.been.calledOnce;
    });

    it('should call instanceFormatAsHal with correct args', function() {
      instanceFormatAsHal.should.have.been.calledWith(request.href, instance);
    });

    it('should call res.hal with correct args', function() {
      response.hal.should.have.been.calledWith(formattedInstance);
    });

    it('should call res.hal once', function() {
      response.hal.should.have.been.calledOnce;
    });

  });

  describe('when getting an instance with an invalid instanceId it', function() {
    var request,
        response;    

    before(function() {
      validator.isUUID.returns(false);
      request = createRequest();
      response = createResponse();
    });

    it('should call validator.isUUID once', function() {
      validator.isUUID.should.have.been.calledOnce;
    });
    
    it('should call validator.isUUID with correct args', function() {
      validator.isUUID.should.have.been.calledWith(request.params.instanceId);
    });

    // TODO: validate request.params with schema and make it throw exceptions when invalid
    /*
    it('should throw an exception when instanceId is invalid', function() {
      
    });
    */
  });

});