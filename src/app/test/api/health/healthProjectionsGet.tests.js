require('../handler-base')();

function createHandler(eventStoreClientProxy) {
  return proxyquire('../../api/health/healthProjectionsGet', {
    '../helpers/eventStoreClient': eventStoreClientProxy
  });
}

describe('healthProjectionsGet', function() {

  describe('when all projections Running', function() {
    var response, request, eventStoreClientProxy, esResponse;

    before(function() {
      response = httpMocks.createResponse();
      response.json = sinon.spy();

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/api/health/projections'
      });

      esResponse = {
        projections: [
          {
            name: 'Awesome',
            status: 'Running'
          },
          {
            name: 'Unbroken',
            status: 'Running'
          }
        ]
      };

      eventStoreClientProxy = {
        projections: {
          getAsync: sinon.stub()
        }
      };

      eventStoreClientProxy.projections.getAsync.resolves({body: JSON.stringify(esResponse) });

      createHandler(eventStoreClientProxy)(request, response);
    });

    it('should call eventStoreClient.projections.getAsync with no arguments.', function() {
      eventStoreClientProxy.projections.getAsync.should.have.been.calledWith();
    });

    it('should call res.json with {"status" :"healthy"} and no projections.', function() {
      var expectedResponse = {'status': 'healthy'};
      response.json.should.have.been.calledWith(expectedResponse);
    });
  });

  describe('when one or more projections not Running', function() {
    var response, request, eventStoreClientProxy, esResponse;

    before(function() {
      response = httpMocks.createResponse();
      response.json = sinon.spy();

      request = httpMocks.createRequest({
        method: 'GET',
        url: '/api/health/projections'
      });

      esResponse = {
        projections: [
          {
            name: 'Awesome',
            status: 'Running'
          },
          {
            name: 'Broken',
            status: 'Corrupted'
          }
        ]
      };

      eventStoreClientProxy = {
        projections: {
          getAsync: sinon.stub()
        }
      };

      eventStoreClientProxy.projections.getAsync.resolves({body: JSON.stringify(esResponse) });

      createHandler(eventStoreClientProxy)(request, response);
    });

    it('should call eventStoreClient.projections.getAsync with no arguments.', function() {
      eventStoreClientProxy.projections.getAsync.should.have.been.calledWith();
    });

    it('should call res.json with {"status": "errors"} and non-running projections.', function() {
      var expectedResponse = {'status': 'errors'};
      expectedResponse.projections = [esResponse.projections[1]];
      response.json.should.have.been.calledWith(expectedResponse);
    });
  });

});