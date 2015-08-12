require('../handler-base')();
var MalformedPushEventError = require('../../../middleware/malformedPushEventError');

var validateUUID = sinon.stub(),
  eventStore = {
    queryStatePartitionById: sinon.stub(),
    postToStream: sinon.stub().resolves()
  },
  translator = {
    translatePush: sinon.stub()
  },
  commitsAddedFormatAsHal = sinon.stub(),
  githubValidator = sinon.stub(),
  translatorFactory = {
    create: sinon.stub()
  };

var handler = proxyquire('../../api/inboxes/commitsCreate', {
  '../validateUUID': validateUUID,
  '../helpers/eventStoreClient': eventStore,
  '../translators/translatorFactory': translatorFactory,
  './commitsAddedFormatAsHal': commitsAddedFormatAsHal
});

describe('commitsCreate', function() {

  var instanceId = '872512eb-0d42-41fa-9a4e-fcb480ef265f',
    inboxId = 'e70ee98d-cd21-4bfe-a4fe-bbded9ce4584',
    digestId = 'ff1fdc30-d0e2-465b-b23d-fda510acc1bc',
    postToStreamArgs,
    request,
    response,
    inboxData,
    formattedCommits,
    events;

  before(function() {
    eventStore.queryStatePartitionById.resolves({
      digestId: digestId
    });

    formattedCommits = sinon.spy();
    commitsAddedFormatAsHal.returns(formattedCommits);

    translatorFactory.create.returns(translator);
    translator.translatePush.returns(events);

    request = httpMocks.createRequest({
      method: 'POST',
      url: '/api/' + instanceId + '/inboxes/' + inboxId + '/commits',
      body: sinon.spy(),
      headers: sinon.spy()
    });

    response = httpMocks.createResponse();
    request.instance = {
      instanceId: instanceId
    };
    request.inbox = {
      digestId: digestId
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
      events: events
    };

  });

  describe('when posting a translatable push event', function() {
    before(function() {
      handler(request, response);
    });

    it('should call validateUUID with correct args', function() {
      validateUUID.should.have.been.calledWith('inbox', inboxId);
    });

    it('should call translator.translatePush with correct args', function() {
      translator.translatePush.should.have.been.calledWith(request.body, instanceId, digestId, inboxId);
    });

    it('should call eventStore.postToStream with correct args', function() {
      eventStore.postToStream.should.have.been.calledWith(postToStreamArgs);
    });

    it('should call commitsAddedFormatAsHal with correct args', function() {
      commitsAddedFormatAsHal.should.have.been.calledWith(request.href, instanceId, inboxData);
    });

    it('should call res.hal with correct args', function() {
      response.hal.should.have.been.calledWith(formattedCommits, 201);
    });

    it('should call translatorFactory.create with correct args', function() {
      translatorFactory.create.should.have.been.calledWithExactly(request);
    });
  });

  describe('when posting a non-translatable push event', function() {
    before(function() {
      translatorFactory.create.returns(undefined);
    });

    it('it should throw a MalformedPushEvent error.', function() {
      var invokeCommitsCreate = function() {
        handler(request, response);
      }
      invokeCommitsCreate.should.throw(MalformedPushEventError);
    });
  });
});