var chai = require('chai'),
  should = chai.should(),
  validator = require('validator'),
  _ = require('underscore'),
  hypermediaResponse = require('../../api/hypermediaResponse');

// see jsonpath, appcatalog has some in it appcatalogentry.schema
describe('hypermediaResponse', function() {
  describe('when constructing a hypermedia response for digest', function() {
    var digestID = '7f74aa58-74e0-11e4-b116-123b93f75cba';
    var hypermedia = hypermediaResponse.digest('http', 'localhost', digestID);

    it('the digestUrl should be a valid URI', function() {
        validator.isURL(hypermedia.digestUrl).should.be.true;
    });

    it('it should have an id to identify the digest', function() {
        hypermedia.should.have.property('id');
    });

    it('the id for a digest should be a valid uuid', function() {
      var id = hypermedia.id;
      validator.isUUID(id).should.be.true;
    });

    it('the digestUrl should contain the id of the digest', function() {
      var digestUrlParts = hypermedia.digestUrl.split('/');
      var id = digestUrlParts[digestUrlParts.length - 1];
      id.should.equal(hypermedia.id);
    });

    it('it should have links to other resources', function() {
      hypermedia.should.include.key('_links');
    });

    it('it should have a link to itself', function() {
      var selfLink = _.find(hypermedia._links, function(element) { return element.rel === 'self'; });
      selfLink.should.have.property('rel', 'self');
    });

    it('it\'s self link should be to the appropriate href.', function() {
      var selfLink = _.find(hypermedia._links, function(element) { return element.rel === 'self'; });
      selfLink.should.have.property('href','http://localhost/api/digest');
    } );

    // inbox-form
    it('it should link to an inbox form to create an inbox', function() {
      var link = _.find(hypermedia._links, function(element) { return element.rel === 'inbox-form'; });
      link.should.have.property('rel', 'inbox-form');
    });

    it('it should have an HTTP GET verb to interract with the inbox form ', function() {
      var link = _.find(hypermedia._links, function(element) { return element.rel === 'inbox-form'; });
      link.should.have.property('method', 'GET');
    });

    it('it should have a reference to the inbox form', function() {
      var link = _.find(hypermedia._links, function(element) { return element.rel === 'inbox-form'; });
      link.should.have.property('href', hypermedia.digestUrl + '/inbox/new');
    });

    it('the link for inbox form should have a description', function() {
      var link = _.find(hypermedia._links, function(element) { return element.rel === 'inbox-form'; });
      link.should.have.property('description', 'Navigate to form for creating an inbox for a repository on digest ' + digestID);
    });

    // inbox-create
    it('it should link to an inbox resource to create an inbox', function() {
      var link = _.find(hypermedia._links, function(element) { return element.rel === 'inbox-create'; });
      link.should.have.property('rel', 'inbox-create');
    });

    it('it should have an HTTP POST verb to create the inbox', function() {
      var link = _.find(hypermedia._links, function(element) { return element.rel === 'inbox-create'; });
      link.should.have.property('method', 'POST');
    });

    it('it should have a reference to the inbox create resource', function() {
      var link = _.find(hypermedia._links, function(element) { return element.rel === 'inbox-create'; });
      link.should.have.property('href', hypermedia.digestUrl + '/inbox');
    });

    it('the link for inbox creation should have a description', function() {
      var link = _.find(hypermedia._links, function(element) { return element.rel === 'inbox-create'; });
      link.should.have.property('description', 'Endpoint for creating an inbox for a repository on digest ' + digestID);
    });


  })

  describe('when constructing a hypermedia response for inbox', function() {
    var hypermedia = hypermediaResponse.inbox('http', 'localhost', '7f74aa58-74e0-11e4-b116-123b93f75cba');

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

    it('it should have a link to itself', function() {
      var selfLink = _.find(hypermedia._links, function(element) { return element.rel === 'self'; });
      selfLink.should.have.property('rel', 'self');
    });

    it('it\'s self link should be to the appropriate href.', function() {
      var selfLink = _.find(hypermedia._links, function(element) { return element.rel === 'self'; });
      selfLink.should.have.property('href','http://localhost/api/inbox');
    } );

    // digest-form
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
