var chai = require('chai'),
  should = chai.should(),
  sinon = require('sinon'),
  sinonChai = require('sinon-chai'),
  Bluebird = require('bluebird'),
  sinonAsPromised = require('sinon-as-promised')(Bluebird),
  httpMocks = require('node-mocks-http'),
  proxyquire = require('proxyquire').noPreserveCache(),
  uuid = require('uuid-v4'),
  config = require('../../../config');
config.eventStorePassword = '123';
config.eventStoreUser = 'admin';
config.eventStoreBaseUrl = 'http://nothing:7887';  

//Things that proxyquire will use.

var instanceAdded = {
    create: sinon.stub()
  },
  eventStore = {
    postToStream: sinon.stub().resolves()
  },
  instanceFormatAsHal = sinon.stub();

// Configure up the controller use proxyquire
var handler = proxyquire('../../../api/instances/instanceCreate', {
  '../events/instanceAdded': instanceAdded,
  './instanceFormatAsHal': instanceFormatAsHal,
  '../helpers/eventStoreClient': eventStore
});

// Configure chai
chai.use(sinonChai);
chai.config.includeStack = true;

describe('instanceCreate', function() {

  describe('when creating an instance', function() {
    var args,
        instanceAddedEvent,
        formattedInstance,
        request,
        response;

    before(function() {
      var eventId = uuid();
      var instanceId = uuid();
      var apiKey = uuid();

      instanceAddedEvent = {
        eventType: 'InstanceAdded',
        eventId: eventId,
        data: {
          instanceId: instanceId,
          apiKey: apiKey,
        }
      };

      args = {
        name: 'instances',
        events: instanceAddedEvent
      };

      instanceAdded.create.returns(instanceAddedEvent);

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

      var data = response._getData();
      console.log(data);
    });

    it('it should call instanceAdded.create once to create an event', function() {
      instanceAdded.create.should.have.been.calledOnce;
    });

    it('it should call instanceAdded.create without any args', function() {
      instanceAdded.create.should.have.been.calledWith();
    });

    it('it should call eventStore.postToStream with correct args', function() {
      eventStore.postToStream.should.have.been.calledWith(args)
    });

    it('it should call instanceFormatAsHal once', function() {
      instanceFormatAsHal.should.have.been.calledOnce;
    });

    it('it should call instanceFormatAsHal with correct args', function() {
      instanceFormatAsHal.should.have.been.calledWith(sinon.match.func, instanceAddedEvent.data);
    });

    it('it should call res.hal with correct args', function() {
      response.hal.should.have.been.calledWith(formattedInstance, 201);
    });

    it('it should call res.hal once', function() {
      response.hal.should.have.been.calledOnce;
    });
    
  });

});