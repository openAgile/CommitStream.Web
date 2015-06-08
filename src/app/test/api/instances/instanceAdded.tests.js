require('../handler-base')();

var uuidStub = sinon.stub(),
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

    it('should call uuid three times', function() {
      uuidStub.should.have.been.calledThrice;
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

      it('has data.apiKey of ' + apiKey, function() {
        instanceAddedEvent.data.should.have.property('apiKey', apiKey);
      });

    });
  });
});