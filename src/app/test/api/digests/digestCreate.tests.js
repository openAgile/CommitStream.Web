require('../handler-base')();

var digestAdded = {
    create: sinon.stub()
  },
  eventStore = {
    postToStream: sinon.stub().resolves()
  },
  digestFormatAsHal = sinon.stub(),
  sanitizeAndValidate = sinon.stub();

// Configure up the controller use proxyquire
var handler = proxyquire('../../api/digests/digestCreate', {
  './digestAdded': digestAdded,
  './digestFormatAsHal': digestFormatAsHal,
  '../helpers/eventStoreClient': eventStore,
  '../helpers/setTimeout': fakeTimeout,
  '../sanitizeAndValidate': sanitizeAndValidate
});

describe('digestCreate', function() {

  describe('when creating a digest it', function() {
    var instanceId = '872512eb-0d42-41fa-9a4e-fcb480ef265f',
      args,
      digestAddedEvent,
      formattedDigest,
      description,
      request,
      response;

    before(function() {
      digestAddedEvent = {
        data: sinon.stub()
      };

      digestAdded.create.returns(digestAddedEvent);

      args = {
        name: 'digests-' + instanceId,
        events: digestAddedEvent
      };

      formattedDigest = sinon.spy();
      digestFormatAsHal.returns(formattedDigest);

      description = sinon.spy();
      request = httpMocks.createRequest({
        method: 'POST',
        url: '/api/' + instanceId + '/digests',
        body: {
          description: description
        }
      });

      response = httpMocks.createResponse();

      // Set up mocks
      request.instance = {
        instanceId: instanceId
      };
      request.href = sinon.spy();
      response.hal = sinon.spy();

      handler(request, response);
    });

    it('should call sanitizeAndValidate with correct args', function() {
      sanitizeAndValidate.should.have.been.calledWith('digest', request.body, ['description'], digestAdded);
    });

    it('should call digestAdded.create with correct args', function() {
      digestAdded.create.should.have.been.calledWith(instanceId, description);
    });

    it('should call eventStore.postToStream with correct args', function() {
      eventStore.postToStream.should.have.been.calledWith(args);
    });

    it('should call digestFormatAsHal with correct args', function() {
      digestFormatAsHal.should.have.been.calledWith(request.href, instanceId, digestAddedEvent.data);
    });

    it('should call res.hal with correct args', function() {
      response.hal.should.have.been.calledWith(formattedDigest, 201);
    });
  });

});