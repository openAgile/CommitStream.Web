require('../handler-base')();

var inboxAdded = {
    create: sinon.stub()
  },
  eventStore = {
    queryStatePartitionById: sinon.stub(),
    postToStream: sinon.stub()
  },
  inboxFormatAsHal = sinon.stub(),
  sanitizeAndValidate = sinon.stub();

var handler = proxyquire('../../api/inboxes/inboxCreate', {
  './inboxAdded': inboxAdded,
  './inboxFormatAsHal': inboxFormatAsHal,
  '../helpers/eventStoreClient': eventStore,
  '../helpers/setTimeout': fakeTimeout,
  '../sanitizeAndValidate': sanitizeAndValidate
});

describe('inboxCreate', function() {

  describe('when creating an inbox it', function() {
    var instanceId = '872512eb-0d42-41fa-9a4e-fcb480ef265f',
      digestId = 'e70ee98d-cd21-4bfe-a4fe-bbded9ce4584',
      digest,
      queryStatePartitionArgs,
      postToStreamArgs,
      inboxAddedEvent,
      formattedInbox,
      request,
      response;

    before(function() {
      queryStatePartitionArgs = {
        name: 'digest',
        id: digestId
      };

      digest = sinon.spy();
      eventStore.queryStatePartitionById.resolves(digest);

      inboxAddedEvent = {
        data: sinon.spy()
      };

      inboxAdded.create.returns(inboxAddedEvent);

      postToStreamArgs = {
        name: 'inboxes-' + instanceId,
        events: inboxAddedEvent
      };

      eventStore.postToStream.resolves();

      formattedInbox = sinon.spy();
      inboxFormatAsHal.returns(formattedInbox);

      request = httpMocks.createRequest({
        method: 'POST',
        url: '/api/' + instanceId + '/digests/' + digestId + '/inboxes',
        body: {
          name: 'My inbox',
          family: 'GitHub',
          url: 'http://www.github.com/openAgile/CommitStream.Web'
        },
        params: {
          instanceId: instanceId,
          digestId: digestId
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
      sanitizeAndValidate.should.have.been.calledWith('inbox', request.body, ['family', 'name', 'url'], inboxAdded);
    });
    
    it('should call inboxAdded.create with correct args', function() {
      inboxAdded.create.should.have.been.calledWith(instanceId, digestId, request.body.family, request.body.name, request.body.url);
    });

    it('should call eventStore.postToStream with correct args', function() {
      eventStore.postToStream.should.have.been.calledWith(postToStreamArgs);
    });

    it('should call inboxFormatAsHal with correct args', function() {
      inboxFormatAsHal.should.have.been.calledWith(request.href, instanceId, inboxAddedEvent.data);
    });

    it('should call res.hal with correct args', function() {
      response.hal.should.have.been.calledWith(formattedInbox, 201);
    });

  });

});