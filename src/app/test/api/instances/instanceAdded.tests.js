require('../handler-base')();

var validator = require('validator'),
  uuidStub = sinon.stub(),
  instanceAdded = proxyquire('../../api/instances/instanceAdded', {
    'uuid-v4': uuidStub
  });

describe('instanceAdded', function() {
  describe('when create called to generate an instance', function() {
    var eventId = '87b66de8-8307-4e03-b2d3-da447c66501a';
    var instanceId = '10ca8895-7ed5-40ae-a50f-f152a4ecdf7f';
    var apiKey = '7f74aa58-74e0-11e4-b116-123b93f75cba';

    uuidStub.onCall(0).returns(eventId);
    uuidStub.onCall(1).returns(instanceId);
    uuidStub.onCall(2).returns(apiKey);

    var instanceAddedEvent = instanceAdded.create();

    it('should call uuid to get eventId of ' + eventId, function() {
      uuidStub.returnValues[0].should.equal(eventId);
    });

    it('should call uuid to get instanceId of ' + instanceId, function() {
      uuidStub.returnValues[1].should.equal(instanceId);
    });

    it('should call uuid to get apiKey of ' + apiKey, function() {
      uuidStub.returnValues[2].should.equal(apiKey);
    });

    describe('the return value', function() {
      it('has eventType of InstanceAdded', function() {
        instanceAddedEvent.should.have.property('eventType', 'InstanceAdded');
      });

      it('has eventId of ' + eventId, function() {
        instanceAddedEvent.should.have.property('eventId', eventId);
      });

      it('has data of type Object', function() {
        instanceAddedEvent.data.should.be.an('object');
      });

      it('has data.instanceId of ' + instanceId, function() {
        instanceAddedEvent.data.should.have.property('instanceId', instanceId);
      });

    });
  });
});