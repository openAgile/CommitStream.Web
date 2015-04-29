require('../handler-base')();

var uuidStub = sinon.stub(),
  inboxAdded = proxyquire('../../api/inboxes/inboxAdded', {
    'uuid-v4': uuidStub
  });

describe('inboxAdded', function() {
  describe('when create called to generate an event', function() {
    var eventId = '11111111-1111-4111-1111-111111111111';
    var digestId = '22222222-2222-4222-2222-222222222222';
    var inboxId = '33333333-3333-4333-3333-333333333333';
    var family = 'a random family';
    var name = 'a random name';
    var url = 'http://random.url.com';

    uuidStub.onCall(0).returns(eventId);
    uuidStub.onCall(1).returns(inboxId);

    var inboxAddedEvent = inboxAdded.create(digestId, family, name, url);

    it('should call uuid twice times', function() {
      uuidStub.should.have.been.calledTwice;
    });

    describe('the return value', function() {
      it('has eventType of InboxAdded', function() {
        inboxAddedEvent.should.have.property('eventType', 'InboxAdded');
      });

      it('has eventId of ' + eventId, function() {
        inboxAddedEvent.should.have.property('eventId', eventId);
      });

      it('has data of type Object', function() {
        inboxAddedEvent.data.should.be.an('object');
      });

      it('has data.instanceId of passed argument value', function() {
        inboxAddedEvent.data.should.have.property('digestId', digestId);
      });

      it('has data.description of passed argument value', function() {
        inboxAddedEvent.data.should.have.property('family', family);
      });

      it('has data.description of passed argument value', function() {
        inboxAddedEvent.data.should.have.property('url', url);
      });

      it('has data.description of passed argument value', function() {
        inboxAddedEvent.data.should.have.property('name', name);
      });

      it('has data.description of passed argument value', function() {
        inboxAddedEvent.data.should.have.property('inboxId', inboxId);
      });
    });
  });
});