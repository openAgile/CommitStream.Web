require('../handler-base')();

var validator = require('validator'),
  uuidStub = sinon.stub(),
  digestAdded = proxyquire('../../api/digests/digestAdded', {
    'uuid-v4': uuidStub
  });

describe('digestAdded', function() {
  describe('when create called to generate an event', function() {
    var eventType = 'DigestAdded';
    var eventId = '87b66de8-8307-4e03-b2d3-da447c66501a';
    var digestId = '7f74aa58-74e0-11e4-b116-123b93f75cba';
    var instanceId = '10ca8895-7ed5-40ae-a50f-f152a4ecdf7f';
    var description = 'my first digest';

    uuidStub.onCall(0).returns(eventId);
    uuidStub.onCall(1).returns(digestId);

    var digestAddedEvent = digestAdded.create(instanceId, description);

    it('should call uuid to get eventId of ' + eventId, function() {
      uuidStub.returnValues[0].should.equal(eventId);
    });

    it('should call uuid to get digestId of ' + digestId, function() {
      uuidStub.returnValues[1].should.equal(digestId);
    });

    describe('the return value', function() {
      it('has eventType of DigestAdded', function() {
        digestAddedEvent.should.have.property('eventType', 'DigestAdded');
      });

      it('has eventId of ' + eventId, function() {
        digestAddedEvent.should.have.property('eventId', eventId);
      });

      it('has eventId of type UUID', function() {
        validator.isUUID(digestAddedEvent.eventId).should.be.true;
      });

      it('has data of type Object', function() {
        digestAddedEvent.data.should.be.an('object');
      });

      it('has data.digestId of ' + eventId, function() {
        digestAddedEvent.data.should.have.property('digestId', digestId);
      });

      it('has data.digestId of type UUID', function() {
        validator.isUUID(digestAddedEvent.data.digestId).should.be.true;
      });

      it('has data.description of passed argument value', function() {
        digestAddedEvent.data.should.have.property('description', description);
      });

      it('has data.instanceId of passed argument value', function() {
        digestAddedEvent.data.should.have.property('instanceId', instanceId);
      });

    });
  });
});