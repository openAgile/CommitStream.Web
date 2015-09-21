require('../handler-base')();

var cache = sinon.spy();
var cacheCreate = sinon.stub().returns(cache);
var commitsSpy = sinon.spy();
var commitsGet = sinon.stub().resolves(commitsSpy);
var commitsChildrenGet = sinon.stub().resolves(commitsSpy);

var handler = proxyquire('../../api/instances/instanceCommitsGet', {
  '../helpers/commitsGet': commitsGet,
  '../helpers/cacheCreate': cacheCreate,
  '../helpers/commitsChildrenGet': commitsChildrenGet
});

function createRequest() {
  var request = httpMocks.createRequest({
    method: 'GET',
    url: '/api/instances/instanceCommitsGet'
  });
  request.href = sinon.spy();
  request.query = sinon.spy();
  request.instance = {
    instanceId: '1234'
  };
  request.query = {
    numbers: ''
  };
  return request;
}

function createResponse() {
  var response = httpMocks.createResponse();
  response.hal = sinon.spy();
  response.send = sinon.spy();
  return response;
}

describe('instanceCommitsGet', function() {

  describe('when getting commits from an instance for a single asset', function() {
    var request = createRequest();
    var response = createResponse();
    request.query.numbers = 'S-00011';

    handler(request, response);

    var stream = 'versionOne_CommitsWithWorkitems-1234_S-00011';

    it('should call cacheCreate once', function() {
      cacheCreate.should.have.been.calledOnce;
    });

    it('should call commitsGet with the proper arguments', function() {
      commitsGet.should.have.been.calledWith(request.query, stream, sinon.match.func, cache);
    });

    it('should call response.send with the proper args', function() {
      response.send.should.have.been.calledWith(commitsSpy);
    });
  });

  describe('when getting commits from an instance for multiple assets', function() {
    var request = createRequest();
    var response = createResponse();
    request.query.numbers = 'S-00001,T-00002';

    handler(request, response);

    var streams = ['versionOne_CommitsWithWorkitems-1234_S-00001', 'versionOne_CommitsWithWorkitems-1234_T-00002'];

    it('should call cacheCreate once', function() {
      cacheCreate.should.have.been.calledOnce;
    });

    it('should call commitsChildrenGet with the proper arguments', function() {
      commitsChildrenGet.should.have.been.calledWith(request.query, streams, sinon.match.func);
    });

    it('should call response.send with the proper args', function() {
      response.send.should.have.been.calledWith(commitsSpy);
    });
  });

});
