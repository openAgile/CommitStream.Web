require('../handler-base')();

var cache = sinon.spy(),
  cacheCreate = sinon.stub().returns(cache),
  commitsGet = sinon.stub();

var handler = proxyquire('../../api/digests/digestCommitsGet', {
  '../helpers/commitsGet': commitsGet,
  '../helpers/cacheCreate': cacheCreate
});

describe('digestCommitsGet', function() {

  describe('when getting a list of commits', function() {
    var instanceId = '872512eb-0d42-41fa-9a4e-fcb480ef265f',
      digestId = 'ff464ed1-b395-4a4d-8b18-b43f9b3790a9',
      commits,
      request,
      response;

    before(function() {

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/api/' + instanceId + '/digests/' + digestId + '/commits'
      });

      response = httpMocks.createResponse();

      request.instance = {
        instanceId: instanceId
      };
      request.params = {
        digestId: digestId
      };
      request.href = sinon.stub();
      request.query = sinon.spy();
      response.send = sinon.spy();
      commits = sinon.spy();
      commitsGet.resolves(commits);

      handler(request, response);
    });

    it('should call cacheCreate once', function() {
      cacheCreate.should.have.been.calledOnce;
    });

    it('should call commitsGet with correct args', function() {
      commitsGet.should.have.been.calledWith(request.query, 'digestCommits-ff464ed1-b395-4a4d-8b18-b43f9b3790a9', sinon.match.func, cache);
    });

    it('should call res.send with correct args', function() {
      response.send.should.have.been.calledWith(commits);
    });

  });

});