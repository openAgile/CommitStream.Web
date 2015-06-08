require('../handler-base')();

function createHandler(digestFormatAsHal, validateUUID) {
  return proxyquire('../../api/digests/digestGet', {
    './digestFormatAsHal': digestFormatAsHal,
    '../validateUUID': validateUUID
  });
}

describe('digestGet', function() {

  describe('with a valid, uuid digest identifier it', function() {
    var instanceId = '872512eb-0d42-41fa-9a4e-fcb480ef265f',
      request,
      digestId,
      digestInfoStub = {
        digestId: digestId,
        description: 'My first Digest.'
      };

    var digestFormatAsHal = sinon.stub(),
      validateUUID = sinon.spy();

    before(function() {

      formattedDigestStub = sinon.spy();
      digestFormatAsHal.returns(formattedDigestStub);

      digestId = 'aFakeId';

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/api/' + instanceId + '/digests/' + digestId,
        body: {
          description: 'My first Digest.'
        },
        params: {
          digestId: digestId,
          instanceId: instanceId
        }
      });

      request.href = sinon.spy();
      request.digest = sinon.spy();

      response = httpMocks.createResponse();
      response.hal = sinon.spy();

      createHandler(digestFormatAsHal, validateUUID)(request, response);
    });

    it('should call validateUUID with appropriate arguments.', function() {
      validateUUID.should.be.calledWith('digests', digestId);
    });

    it('should call digestFormatAsHal with correct arguments.', function() {
      digestFormatAsHal.should.have.been.calledWith(request.href, request.params.instanceId, request.digest);
    });

    it('should call res.hal with correct arguments.', function() {
      response.hal.should.have.been.calledWith(formattedDigestStub);
    });
  });

});