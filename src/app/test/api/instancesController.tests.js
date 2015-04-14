// require('../helpers')(global);
var chai = require('chai'),
  should = chai.should(),
  express = require('express'),
  app = require('../../middleware/appConfigure')(express()),
  sinon = require('sinon'),
  sinonChai = require('sinon-chai'),
  Bluebird = require('bluebird'),
  sinonAsPromised = require('sinon-as-promised')(Bluebird),
  request = require('supertest'),
  proxyquire = require('proxyquire').noPreserveCache(),
  uuid = require('uuid-v4');

// /* We must provide some dummy values here for the module: */
var config = require('../../config');
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
var controller = proxyquire('../../api/instancesController', {
  './events/instanceAdded': instanceAdded,
  './helpers/eventStoreClient': eventStore,
  './instances/instanceFormatAsHal': instanceFormatAsHal
});

// Configure chai
chai.use(sinonChai);
chai.config.includeStack = true;

// Initialize the controller with express
controller.init(app);

var postInstance = function(shouldBehaveThusly) {
  request(app)
    .post('/api/instances')
    .end(shouldBehaveThusly);
};

describe('instancesController', function() {

  describe('when creating an instance', function() {

    var args;
    var instanceAddedEvent;
    var response;

    before(function(done) {
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

      postInstance(function(err, res) {
        console.log(res.text)
        response = res;
        done();
      });

    });

    it('it should ask instanceAdded to create an event', function() {
      instanceAdded.create.should.have.been.calledOnce;
    });

    it('it should pass correct args when posting to the eventStore stream', function() {
      eventStore.postToStream.should.have.been.calledWith(args)
    });

    it('it should pass correct args when calling instanceFormatAsHal function', function() {
      instanceFormatAsHal.should.have.been.calledWith(sinon.match.func, instanceAddedEvent.data);
    });


    it('it should call res.hal', function() {
      //response.hal.should.have.been.calledOnce;
    });


    // instanceAdded.create.resolves({});

    // instanceAdded.create().then(function() {
    //   console.log("We got resolved....");
    // });

  });

});
