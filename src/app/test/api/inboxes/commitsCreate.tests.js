require('../handler-base')();

var validateUUID = sinon.stub(),
  eventStore = {
    queryStatePartitionById: sinon.stub(),
    postToStream: sinon.stub().resolves()
  },
  translator = {
    translatePush: sinon.stub()
  },
  commitsAddedFormatAsHal = sinon.stub(),
  githubValidator = sinon.stub();

var handler = proxyquire('../../api/inboxes/commitsCreate', {
  '../validateUUID': validateUUID,
  '../helpers/eventStoreClient': eventStore,
  '../translators/githubTranslator': translator,
  './commitsAddedFormatAsHal': commitsAddedFormatAsHal,
  '../helpers/githubValidator': githubValidator
});

describe('commitsCreate', function() {

  describe('when posting a push event', function() {
    var instanceId = '872512eb-0d42-41fa-9a4e-fcb480ef265f',
      inboxId = 'e70ee98d-cd21-4bfe-a4fe-bbded9ce4584',
      digestId = 'ff1fdc30-d0e2-465b-b23d-fda510acc1bc',
      queryStatePartitionArgs,
      postToStreamArgs,
      request,
      response,
      inboxData;

    before(function() {
      eventStore.queryStatePartitionById.resolves({
        digestId: digestId
      });

      githubValidator.returns('push');

      commitsAddedFormatAsHal.returns({});
      translator.translatePush.returns({});

      request = httpMocks.createRequest({
        method: 'POST',
        url: '/api/' + instanceId + '/inboxes/' + inboxId + '/commits',
        body: {},
        headers: {}
      });

      response = httpMocks.createResponse();
      request.instance = {
        instanceId: instanceId
      };
      request.params = {
        inboxId: inboxId
      };
      request.href = sinon.spy();
      response.hal = sinon.spy();

      inboxData = {
        inboxId: inboxId,
        digestId: digestId
      };

      postToStreamArgs = {
        name: 'inboxCommits-' + inboxId,
        events: '{}'
      };

      queryStatePartitionArgs = {
        name: 'inbox',
        id: inboxId
      };

      handler(request, response);

    });

    it('should call validateUUID with correct args', function() {
      validateUUID.should.have.been.calledWith('inbox', inboxId);
    });

    it('should call eventStore.queryStatePartitionById with correct args', function() {
      eventStore.queryStatePartitionById.should.have.been.calledWith(queryStatePartitionArgs);
    });

    it('should call githubValidator with correct args', function() {
      githubValidator.should.have.been.calledWith({});
    });

    it('should call translator.translatePush with correct args', function() {
      translator.translatePush.should.have.been.calledWith({}, instanceId, digestId, inboxId);
    });

    it('should call eventStore.postToStream with correct args', function() {
      eventStore.postToStream.should.have.been.calledWith(postToStreamArgs);
    });

    it('should call commitsAddedFormatAsHal with correct args', function() {
      commitsAddedFormatAsHal.should.have.been.calledWith(request.href, instanceId, inboxData);
    });

    it('should call res.hal with correct args', function() {
      response.hal.should.have.been.calledWith({}, 201);
    });

  });

});