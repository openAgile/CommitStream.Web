require('../handler-base')();

var uuidStub = sinon.stub(),
  digestAdded = proxyquire('../../api/digests/digestAdded', {
    'uuid-v4': uuidStub
  });

describe('digestAdded', function() {
  describe('when create called to generate an event', function() {
    var eventId = '87b66de8-8307-4e03-b2d3-da447c66501a';
    var instanceId = '10ca8895-7ed5-40ae-a50f-f152a4ecdf7f';
    var digestId = '7f74aa58-74e0-11e4-b116-123b93f75cba';
    var description = 'my first digest';

    uuidStub.onCall(0).returns(eventId);
    uuidStub.onCall(1).returns(digestId);

    var digestAddedEvent = digestAdded.create(instanceId, description);

    it('should call uuid three times', function() {
      uuidStub.should.have.been.calledTwice;
    });

    describe('the return value', function() {
      it('has eventType of DigestAdded', function() {
        digestAddedEvent.should.have.property('eventType', 'DigestAdded');
      });

      it('has eventId of ' + eventId, function() {
        digestAddedEvent.should.have.property('eventId', eventId);
      });

      it('has data of type Object', function() {
        digestAddedEvent.data.should.be.an('object');
      });

      it('has data.instanceId of passed argument value', function() {
        digestAddedEvent.data.should.have.property('instanceId', instanceId);
      });

      it('has data.digestId of ' + eventId, function() {
        digestAddedEvent.data.should.have.property('digestId', digestId);
      });

      it('has data.description of passed argument value', function() {
        digestAddedEvent.data.should.have.property('description', description);
      });

    });
  });
});