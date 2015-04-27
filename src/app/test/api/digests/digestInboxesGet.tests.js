require('../handler-base')();

var validateUUID = sinon.stub(),
  eventStore = {
    queryStatePartitionById: sinon.stub()
  },
  digestInboxesFormatAsHal = sinon.stub(),
  csError = {
    ProjectionNotFound: sinon.stub()
  },
  digest,
  inboxes;

var handler = proxyquire('../../api/digests/digestInboxesGet', {
  './digestInboxesFormatAsHal': digestInboxesFormatAsHal,
  '../helpers/eventStoreClient': eventStore,
  '../../middleware/csError': csError,
  '../validateUUID': validateUUID
});

describe('digestInboxesGet', function() {
  var instanceId = '872512eb-0d42-41fa-9a4e-fcb480ef265f',
    digestId = '0dd1eab2-c521-4c4f-9d47-38568564193b',
    digestInboxesFormatted,
    request,
    response;

  describe('when getting the list of inboxes for a digest', function() {

    before(function() {
      digest = {
        digestId: digestId
      };
      inboxes = sinon.spy();
      eventStore.queryStatePartitionById.onFirstCall().resolves(digest);
      eventStore.queryStatePartitionById.onSecondCall().resolves(inboxes);

      digestInboxesFormatAsHal.returns(digestInboxesFormatted);

      request = httpMocks.createRequest();
      response = httpMocks.createResponse();

      // Set up mocks
      request.instance = {
        instanceId: instanceId
      };
      request.params = {
        digestId: digestId
      };
      request.href = sinon.spy();
      response.hal = sinon.spy();

      handler(request, response);
    });

    it('should call validateUUID with correct args', function() {
      validateUUID.should.have.been.calledWith('digest', '0dd1eab2-c521-4c4f-9d47-38568564193b');
    });

    it('should call eventStore.queryStatePartitionById with correct args on first call', function() {
      eventStore.queryStatePartitionById.getCall(0).should.have.been.calledWith({
        name: 'digest',
        id: '0dd1eab2-c521-4c4f-9d47-38568564193b'
      });
    });

    it('should call eventStore.queryStatePartitionById with correct args on second call', function() {
      eventStore.queryStatePartitionById.getCall(1).should.have.been.calledWith({
        name: 'inboxes-for-digest',
        partition: 'digestInbox-0dd1eab2-c521-4c4f-9d47-38568564193b'
      });
    });

    it('should call digestInboxesFormatAsHal with correct args', function() {
      digestInboxesFormatAsHal.should.have.been.calledWith(request.href, instanceId, digest, inboxes);
    });

  });

});