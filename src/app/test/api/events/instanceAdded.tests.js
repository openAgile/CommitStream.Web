var chai = require('chai'),
  should = chai.should(),
  validator = require('validator'),
  proxyquire = require('proxyquire'),
  sinon = require('sinon'),
  uuidStub = sinon.stub(),
  instanceAdded = proxyquire('../../../api/instances/instanceAdded', {
    'uuid-v4': uuidStub
  });

describe('instanceAdded', function() {
  describe('when create called to generate an event', function() {
    var eventType = 'instanceAdded';
    var eventId = '927b600b-dcdd-4a35-b295-e45f17dd2222';
    var instanceId = '1819acbe-1c5f-4a0d-8d8e-21c65b0bad69';
    var apiKey = '88ed2f2f-fc5a-4739-8f59-23eca3284983';

    uuidStub.onCall(0).returns(eventId);
    uuidStub.onCall(1).returns(instanceId);
    uuidStub.onCall(2).returns(apiKey);

    var newEvent = instanceAdded.create();

    it('should call uuid to get eventId of ' + eventId, function() {
      uuidStub.returnValues[0].should.equal(eventId);
    });

    it('should call uuid to get instanceId of ' + instanceId, function() {
      uuidStub.returnValues[1].should.equal(instanceId);
    });

    it('should call uuid to get an apiKey of ' + apiKey, function() {
      uuidStub.returnValues[2].should.equal(apiKey);
    });    

    describe('the return value', function() {
      it('has eventType of InstanceAdded', function() {
        newEvent.should.have.property('eventType', 'InstanceAdded');
      });

      it('has eventId of ' + eventId, function() {
        newEvent.should.have.property('eventId', eventId);
      });

      it('has eventId of type UUID', function() {
        validator.isUUID(newEvent.eventId).should.be.true;
      });
      
      it('has data of type Object', function() {
        newEvent.data.should.be.an('object');
      });      

      it('has data.instanceId of ' + eventId, function() {
        newEvent.data.should.have.property('instanceId', instanceId);
      });

      it('has data.instanceId of type UUID', function() {
        validator.isUUID(newEvent.data.instanceId).should.be.true;
      });

      it('has data.apiKey of '+ apiKey, function() {
        newEvent.data.should.have.property('apiKey', apiKey);
      });

      it('has data.apiKey of type UUID', function() {
        validator.isUUID(newEvent.data.apiKey).should.be.true;
      });      
    });
  });
});