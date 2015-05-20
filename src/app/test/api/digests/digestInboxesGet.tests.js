require('../handler-base')();

function FakeError() {
  this.name = 'FakeError';
  this.message = '';
}

FakeError.prototype = Object.create(Error.prototype);
FakeError.prototype.constructor = FakeError;

function getHandler(digestInboxesFormatAsHal, eventStore, csError, validateUUID) {
  return proxyquire('../../api/digests/digestInboxesGet', {
    './digestInboxesFormatAsHal': digestInboxesFormatAsHal,
    '../helpers/eventStoreClient': eventStore,
    '../../middleware/csError': csError,
    '../validateUUID': validateUUID
  });
}

var instanceId = '872512eb-0d42-41fa-9a4e-fcb480ef265f',
  digestId = '0dd1eab2-c521-4c4f-9d47-38568564193b',
  validateUUID,
  digestInboxesFormatAsHal,
  csError,
  digest,
  inboxes,
  request,
  response;

function initFakes() {
  validateUUID = sinon.stub();
  csError = {
    ProjectionNotFound: FakeError
  };
  digest = {
    digestId: digestId
  };
  inboxes = sinon.spy();

  response = httpMocks.createResponse();
  response.hal = sinon.spy();

  request = httpMocks.createRequest();

  request.instance = {
    instanceId: instanceId
  };
  request.digest = digest;
  request.params = {
    digestId: digestId
  };
  request.href = sinon.spy();
}

describe('digestInboxesGet', function() {
  var eventStore,
    digestInboxesFormatted;

  describe('when getting the list of inboxes for a digest', function() {

    before(function() {

      initFakes();

      digestInboxesFormatted = sinon.spy();
      digestInboxesFormatAsHal = sinon.stub().returns(digestInboxesFormatted);

      eventStore = {
        queryStatePartitionById: sinon.stub()
      };
      eventStore.queryStatePartitionById.resolves(inboxes);

      var handler = getHandler(digestInboxesFormatAsHal, eventStore, csError, validateUUID);
      handler(request, response);

    });

    it('should call validateUUID with correct args', function() {
      validateUUID.should.have.been.calledWith('digest', '0dd1eab2-c521-4c4f-9d47-38568564193b');
    });

    it('should call eventStore.queryStatePartitionById with correct args on first call', function() {
      eventStore.queryStatePartitionById.should.have.been.calledWith({
        name: 'inboxes-for-digest',
        partition: 'digestInbox-0dd1eab2-c521-4c4f-9d47-38568564193b'
      });
    });

    it('should call digestInboxesFormatAsHal with correct args', function() {
      digestInboxesFormatAsHal.should.have.been.calledWith(request.href, instanceId, digest, inboxes);
    });

    it('should call res.hal with correct args', function() {
      response.hal.should.have.been.calledWith(digestInboxesFormatted);
    });

  });

  describe('when projection is not found', function() {
    var eventStore,
      digestInboxesFormatted;

    before(function() {

      initFakes();

      digestInboxesFormatted = sinon.spy();
      digestInboxesFormatAsHal = sinon.stub().returns(digestInboxesFormatted);

      eventStore = {
        queryStatePartitionById: sinon.stub()
      };
      eventStore.queryStatePartitionById.rejects(new csError.ProjectionNotFound());

      var handler = getHandler(digestInboxesFormatAsHal, eventStore, csError, validateUUID);
      handler(request, response);

    });

    it('should call validateUUID with correct args', function() {
      validateUUID.should.have.been.calledWith('digest', '0dd1eab2-c521-4c4f-9d47-38568564193b');
    });

    it('should call eventStore.queryStatePartitionById with correct args on first call', function() {
      eventStore.queryStatePartitionById.should.have.been.calledWith({
        name: 'inboxes-for-digest',
        partition: 'digestInbox-0dd1eab2-c521-4c4f-9d47-38568564193b'
      });
    });

    it('should call digestInboxesFormatAsHal with correct args', function() {
      digestInboxesFormatAsHal.should.have.been.calledWith(request.href, instanceId, digest, {
        inboxes: {}
      });
    });

    it('should call res.hal with correct args', function() {
      response.hal.should.have.been.calledWith(digestInboxesFormatted);
    });

  });

});