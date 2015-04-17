/********************************************

   GET tests

   *******************************************/

describe('when requesting a digest', function() {

  describe('with an invalid, non-uuid digest identifier', function() {
    function get(shouldBehaveThusly) {
      getDigest('/api/e9be4a71-f6ca-4f02-b431-d74489dee5d0/digests/not_a_uuid', shouldBehaveThusly);
    }

    it('it returns a 400 status code', function(done) {
      get(function(err, res) {
        res.statusCode.should.equal(400);
        done();
      });
    });

    it('it returns a meaningful error message', function(done) {
      get(function(err, res) {
        res.text.should.equal('The value "not_a_uuid" is not recognized as a valid digest identifier.');
        done();
      });
    });
  });

  describe('with a valid, uuid digest identifier', function() {

    var uuid = 'e9be4a71-f6ca-4f02-b431-d74489dee5d0';
    var data = {
      "description": "BalZac!",
      "digestId": uuid
    };

    beforeEach(function() {
      hypermediaResponseStub.digestGET = sinon.stub();
      eventStoreClient.queryStatePartitionById = sinon.stub().resolves(data);
    });

    function get(shouldBehaveThusly) {
      getDigest('/api/e9be4a71-f6ca-4f02-b431-d74489dee5d0/digests/' + uuid, shouldBehaveThusly);
    }

    it('calls eventStore.queryStatePartitionById with correct parameters', function(done) {
      get(function(err, res) {
        eventStoreClient.queryStatePartitionById.should.have.been.calledWith({
          name: sinon.match.any,
          id: uuid
        });
        done();
      });
    });

    /*it('calls hypermediaResponse.digestGET with correct parameters', function(done) {
        get(function(err, res) {
          hypermediaResponseStub.digestGET.should.have.been.calledWith(
            sinon.match.func, uuid, data
          );
          done();
        });
      });*/

    it('it returns a 200 status code', function(done) {
      get(function(err, res) {
        res.statusCode.should.equal(200);
        done();
      });
    });

    it('returns a Content-Type of application/hal+json', function(done) {
      get(function(err, res) {
        res.get('Content-Type').should.equal('application/hal+json; charset=utf-8');
        done();
      });
    });
  });

  describe('with a valid, uuid that does not match a real digest', function() {

    beforeEach(function() {
      eventStoreClient.queryStatePartitionById = sinon.stub().resolves();
      eventStoreClient.streams.post = sinon.stub();
      eventStoreClient.projection.getState.callsArgWith(1, null, {
        body: ''
      }); // No error, but nothing found on the remote end
    });

    var uuid = 'ba9f6ac9-fe4a-4ddd-bf07-f1fb37be5dbf';

    function get(shouldBehaveThusly) {
      getDigest('/api/ba9f6ac9-fe4a-4ddd-bf07-f1fb37be5dbf/digests/' + uuid, shouldBehaveThusly);
    }

    /* it('calls eventStore.projection.getState with correct parameters', function(done) {
        get(function(err, res) {
          eventStoreClient.projection.getState.should.have.been.calledWith({
            name: sinon.match.any,
            partition: 'digest-' + uuid
          }, sinon.match.any);
          done();
        });
      });
      
      it('it returns a 404 status code', function(done) {
        get(function(err, res) {
          res.statusCode.should.equal(404);
          done();
        });
      });

      it('returns a Content-Type of application/json', function(done) {
        get(function(err, res) {
          res.get('Content-Type').should.equal('application/json; charset=utf-8');
          done();
        });
      });

      it('it returns a meaningful error message', function(done) {
        get(function(err, res) {
          res.text.should.equal(JSON.stringify({
            'error': 'Could not find a digest with id ' + uuid
          }));
          done();
        });
      });*/
  });

  describe('with an error returned from eventStoreClient', function() {

    beforeEach(function() {
      eventStoreClient.projection.getState = sinon.stub();
      eventStoreClient.streams.post = sinon.stub();
      eventStoreClient.projection.getState.callsArgWith(1, 'Hey there is an error!', {});
    });

    var uuid = '4cc217e4-0802-4f0f-8218-f8e5772aac5b';

    function get(shouldBehaveThusly) {
      getDigest('/api/4cc217e4-0802-4f0f-8218-f8e5772aac5b/digests/' + uuid, shouldBehaveThusly);
    }
    /*
      it('calls eventStore.projection.getState with correct parameters', function(done) {
        get(function(err, res) {
          eventStoreClient.projection.getState.should.have.been.calledWith({
            name: sinon.match.any,
            partition: 'digest-' + uuid
          }, sinon.match.any);
          done();
        });
      });

      it('it returns a 500 status code', function(done) {
        get(function(err, res) {
          res.statusCode.should.equal(500);
          done();
        });
      }); */
  });

  describe('and there is an HTTP timeout of 408 (Request Timeout) that occurs when getting information from eventstore', function() {
    var response;
    var uuid = '4cc217e4-0802-4f0f-8218-f8e5772aac5b';

    before(function() {
      eventStoreClient.projection.getState.callsArgWith(1, null, {
        statusCode: 408
      });
    });

    function get(shouldBehaveThusly) {
      getDigest('/api/4cc217e4-0802-4f0f-8218-f8e5772aac5b/digests/' + uuid, shouldBehaveThusly);
    }

    /*it('it should report that there was an internal error', function(done) {
        get(function(error, response) {
          shouldBeGenericError(response);
          done();
        });

      });

      it('it should report a status code of 500 (Internal Server Error)', function(done) {
        get(function(error, response) {
          response.status.should.equal(500);
          done();
        });
      }); */
  });
});