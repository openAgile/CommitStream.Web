var chai = require('chai'),
  should = chai.should(),
  controller = require('../../api/inboxController'),
  validator = require('validator');
  _ = require('underscore');

chai.config.includeStack = true;

describe('inboxController', function () {
  describe('when creating a hypermedia response', function() {
    var hypermedia = controller.constructHypermedia('http', 'localhost', '7f74aa58-74e0-11e4-b116-123b93f75cba');

    // This particular test created the need for a different method of testing.
    // rather than testing the request/response lifecycle of express, I needed to
    // test the hypermedia specifically. The problem was that I was having trouble getting
    // the protocal and the hostname off the response. Extracting the creation of the hypermedia
    // out of the route definition and into a function on it's own enabled passing parameters
    // into the construction of a hypermedia response, and more testable.
    // Perhaps there still needs to be a test that checks that inboxController.constructHypermedia is called when you
    // hit the route? Perhaps this approach is misguided? Looking for thoughts.
    it('should have an href to the digest form', function() {
      var link = _.find(hypermedia._links, function(element) { return element.rel === 'digest-form'; });
      link.href.should.equal('http://localhost/api/digest/new');
    });

    it('inboxUrl should be a valid URI', function() {
      validator.isURL(hypermedia.inboxUrl).should.be.true;
    });

    it('should have an id to identify the inbox', function() {
      hypermedia.should.have.property('id');
    });

    it('id for a inbox should be a valid uuid', function() {
      validator.isUUID(hypermedia.id).should.be.true;
    });

    it('inboxUrl should contain the id of the inbox', function() {
      var inboxUrlParts = hypermedia.inboxUrl.split('/');
      var id = inboxUrlParts[inboxUrlParts.length - 1];
      id.should.equal(hypermedia.id);
    });

    it('should have links to other resources', function() {
      hypermedia.should.include.key('_links');
    });

    it('should link to an digest form', function() {
      var link = _.find(hypermedia._links, function(element) { return element.rel === 'digest-form'; });
      link.should.have.property('rel', 'digest-form');
    });

    it('should have an HTTP GET verb to interract with the digest form ', function() {
      var link = _.find(hypermedia._links, function(element) { return element.rel === 'digest-form'; });
      link.should.have.property('method', 'GET');
    });

    it('link for digest form should have a description', function() {
      var link = _.find(hypermedia._links, function(element) { return element.rel === 'digest-form'; });
      link.should.have.property('description', 'Navigate to form for creating digest for a group of inboxes');
    })
  })
})