require('../handler-base')();

var uuidStub = sinon.stub(),
  inboxRemoved = proxyquire('../../api/inboxes/inboxRemoved', {
    'uuid-v4': uuidStub
  });

describe('inboxRemoved', function() {
  describe('when create called to generate an event', function() {
    var eventId = '11111111-1111-4111-1111-111111111111',
      digestId = '22222222-2222-4222-2222-222222222222',
      inboxId = '33333333-3333-4333-3333-333333333333',
      instanceId = '44444444-4444-4444-4444-444444444444';

    uuidStub.onCall(0).returns(eventId);

    var inboxRemovedEvent = inboxRemoved.create(instanceId, digestId, inboxId);

    it('should call uuid twice times', function() {
      uuidStub.should.have.been.calledOnce;
    });

    describe('the return value', function() {
      it('has eventType of InboxRemoved', function() {
        inboxRemovedEvent.should.have.property('eventType', 'InboxRemoved');
      });

      it('has eventId of ' + eventId, function() {
        inboxRemovedEvent.should.have.property('eventId', eventId);
      });

      it('has data of type Object', function() {
        inboxRemovedEvent.data.should.be.an('object');
      });

      it('has data.instanceId of passed argument value', function() {
        inboxRemovedEvent.data.should.have.property('instanceId', instanceId);
      });

      it('has data.digestId of passed argument value', function() {
        inboxRemovedEvent.data.should.have.property('digestId', digestId);
      });

      it('has data.inboxId of passed argument value', function() {
        inboxRemovedEvent.data.should.have.property('inboxId', inboxId);
      });
    });
  });
});