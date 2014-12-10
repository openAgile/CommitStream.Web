var chai = require('chai'),
  should = chai.should(),
  validator = require('validator'),
  proxyquire = require('proxyquire'),
  sinon = require('sinon'),
  uuidStub = sinon.stub(),
  digestAdded = proxyquire('../../../api/events/digestAdded', {
    'uuid-v4': uuidStub
  });

describe('digestAdded', function() {
  describe('when create called to generate an event', function() {
    var eventType = 'DigestAdded';
    var eventId = '87b66de8-8307-4e03-b2d3-da447c66501a';
    var digestId = '7f74aa58-74e0-11e4-b116-123b93f75cba';
    var description = 'my first digest';

    uuidStub.onCall(0).returns(eventId);
    uuidStub.onCall(1).returns(digestId);

    var digestAddedEvent = digestAdded.create(description);

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

      it('has digestId of ' + eventId, function() {
        digestAddedEvent.should.have.property('digestId', digestId);
      });

      it('has digestId of type UUID', function() {
        validator.isUUID(digestAddedEvent.digestId).should.be.true;
      });
      
      it('has description of passed argument value', function() {
        digestAddedEvent.should.have.property('description', description);
      });

    });
  });
});
