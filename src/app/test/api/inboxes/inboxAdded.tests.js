require('../handler-base')();

var uuidStub = sinon.stub(),
  inboxAdded = proxyquire('../../api/inboxes/inboxAdded', {
    'uuid-v4': uuidStub
  });

describe('inboxAdded', function() {
  describe('when create called to generate an event', function() {
    var eventId = '11111111-1111-4111-1111-111111111111',
      digestId = '22222222-2222-4222-2222-222222222222',
      inboxId = '33333333-3333-4333-3333-333333333333',
      instanceId = '44444444-4444-4444-4444-444444444444',
      family = 'a random family',
      name = 'a random name',
      url = 'http://random.url.com';

    uuidStub.onCall(0).returns(eventId);
    uuidStub.onCall(1).returns(inboxId);

    var inboxAddedEvent = inboxAdded.create(instanceId, digestId, family, name, url);

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
        inboxAddedEvent.data.should.have.property('instanceId', instanceId);
      });

      it('has data.digestId of passed argument value', function() {
        inboxAddedEvent.data.should.have.property('digestId', digestId);
      });

      it('has data.inboxId of passed argument value', function() {
        inboxAddedEvent.data.should.have.property('inboxId', inboxId);
      });

      it('has data.family of passed argument value', function() {
        inboxAddedEvent.data.should.have.property('family', family);
      });

      it('has data.url of passed argument value', function() {
        inboxAddedEvent.data.should.have.property('url', url);
      });

      it('has data.name of passed argument value', function() {
        inboxAddedEvent.data.should.have.property('name', name);
      });
    });
    describe('when validating', function() {
      var schemaValidator;

      var expectedSchema = {
        properties: {
          digestId: {
            maxLength: 36,
            minLength: 36,
            title: "ID of the digest to which this inbox will belong",
            type: "string"
          },
          family: {
            enum: ["Deveo", "GitHub", "GitLab", "Bitbucket", "VsoGit", "Svn", "GitSwarm", "P4V", "VsoTfvc"],
            title: "Version Control System type",
            type: "string"
          },
          instanceId: {
            maxLength: 36,
            minLength: 36,
            title: "ID of the instance to which this inbox will belong",
            type: "string"
          },
          name: {
            maxLength: 140,
            minLength: 1,
            title: "Short name for this inbox",
            type: "string"
          },
          url: { maxLength: 2000, minLength: 3, title: "URL of the repository", type: "string" }
        },
        required: ["digestId", "family", "name"],
        title: "inbox",
        type: "object"
      };

      before(function() {
          schemaValidator = {
            validate: sinon.spy()
          };

          inboxAdded = proxyquire('../../api/inboxes/inboxAdded', {
            'uuid-v4': sinon.stub(),
            '../schemaValidator': schemaValidator
          });

          inboxAdded.validate({})

      })



      it('the schemaValidator should be called with appropriate arguments', function() {
        schemaValidator.validate.should.have.been.calledWith('inbox', {}, expectedSchema);
      })
    })
  });
});