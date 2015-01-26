var chai = require('chai'),
  should = chai.should(),
  validator = require('validator'),
  _ = require('underscore'),
  hypermediaResponse = require('../../api/hypermediaResponse');

describe('hypermediaResponse', function() {
  describe('when constructing a hypermedia response for digest POST', function() {
    var digestId = '7f74aa58-74e0-11e4-b116-123b93f75cba';
    var hypermedia = hypermediaResponse.digestPOST('http', 'localhost', digestId);

    // helpers
    function getLinkForRel(rel) {
      return hypermedia._links[rel];
    }

    function linkShouldExistWithProperty(rel, property, value) {
      var link = getLinkForRel(rel);
      link.should.have.property(property, value);
    }

    it('the self link href should be a valid URL', function() {
      var selfLink = hypermedia._links['self'];
      validator.isURL(selfLink.href).should.be.true;
    });

    it('it should have links to other resources', function() {
      hypermedia.should.include.key('_links');
    });

    // self link
    it('it should have self a link to the newly created digest', function() {
      hypermedia._links.should.include.key('self')
    });

    it('the self link href should contain the id of the digest', function() {
      var selfLink = hypermedia._links.self;
      var selfLinkParts = selfLink.href.split('/');
      var id = selfLinkParts[selfLinkParts.length - 1];
      id.should.equal(digestId);
    });

    it('should contain the id of the digest as a property', function() {
      hypermedia.digestId.should.equal(digestId);
    });

    it('it\'s self link should reference the digest created.', function() {
      hypermedia._links['self'].should.have.property('href', 'http://localhost/api/digests/' + digestId);
    });

    it('should have a link to get all digests', function() {
      linkShouldExistWithProperty('digests', 'href', 'http://localhost/api/digests');
    });

    it('the digests link should be a valid URL', function() {
      var link = hypermedia._links['digests'];
      validator.isURL(link.href).should.be.true;
    });
  });

  describe('when constructing a hypermedia response for digest GET', function() {
    var digestId = '7f74aa58-74e0-11e4-b116-123b93f75cba';
    var data = {
      "description": "BalZac!",
      "digestId": digestId
    };
    var hypermedia = hypermediaResponse.digestGET('http', 'localhost', digestId, data);

    // helpers
    function getLinkForRel(rel) {
      return hypermedia._links[rel];
    }

    function linkShouldExistWithProperty(rel, property, value) {
      var link = getLinkForRel(rel);
      link.should.have.property(property, value);
    }

    it('the self link href should be a valid URL', function() {
      var selfLink = hypermedia._links['self'];
      validator.isURL(selfLink.href).should.be.true;
    });

    it('it should have links to other resources', function() {
      hypermedia.should.include.key('_links');
    });

    // self link
    it('it should have self a link to itself', function() {
      hypermedia._links.should.include.key('self')
    });

    it('the self link href should contain the id of the digest', function() {
      var selfLink = hypermedia._links.self;
      var selfLinkParts = selfLink.href.split('/');
      var id = selfLinkParts[selfLinkParts.length - 1];
      id.should.equal(digestId);
    });

    it('it\'s self link should reference the digest.', function() {
      hypermedia._links['self'].should.have.property('href', 'http://localhost/api/digests/' + digestId);
    });

    it('should have a link to get all digests', function() {
      linkShouldExistWithProperty('digests', 'href', 'http://localhost/api/digests');
    });

    it('the digests link should be a valid URL', function() {
      var link = hypermedia._links['digests'];
      validator.isURL(link.href).should.be.true;
    });

    it('should embed the description property that was passed', function() {
      hypermedia.should.include.key('description');
      hypermedia.description.should.equal(data.description);
    });

    it('should embed the digestId property that was passed', function() {
      hypermedia.should.include.key('digestId');
      hypermedia.digestId.should.equal(data.digestId);
    });

  });

  describe('when constructing a hypermedia response for inbox creation', function() {
    var inboxId = '0971bdd5-7030-4ffe-ad15-eceb4eea086f';
    var hypermedia = hypermediaResponse.inboxes.POST('http', 'localhost', inboxId);

    // helpers
    function getLinkForRel(rel) {
      return hypermedia._links[rel];
    }

    function linkShouldExistWithProperty(rel, property, value) {
      var link = getLinkForRel(rel);
      link.should.have.property(property, value);
    }

    it('it should have links to other resources', function() {
      hypermedia.should.include.key('_links');
    });

    it('it should have self a link to itself', function() {
      hypermedia._links.should.include.key('self')
    });

    it('the self link href should be a valid URL', function() {
      var selfLink = hypermedia._links['self'];
      validator.isURL(selfLink.href).should.be.true;
    });

    it('the self link href should contain the id of the inbox', function() {
      var selfLink = hypermedia._links.self;
      var selfLinkParts = selfLink.href.split('/');
      var id = selfLinkParts[selfLinkParts.length - 1];
      id.should.equal(inboxId);
    });

    it('it\'s self link should reference the inbox.', function() {
      hypermedia._links['self'].should.have.property('href', 'http://localhost/api/inboxes/' + inboxId);
    });

    it('the inboxId property should exist ', function() {
      hypermedia.should.have.property('inboxId', inboxId);
    });

  });

  describe('when contructing a hypermedia response for getting information about an inbox', function() {
    var inboxId = '0971bdd5-7030-4ffe-ad15-eceb4eea086f';
    var hypermedia = hypermediaResponse.inboxes.uuid.GET('http', 'localhost', {});

    it('it should have links to other resources', function() {
      hypermedia.should.include.key('_links');
    });
  })

});