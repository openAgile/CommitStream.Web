var chai = require('chai'),
  should = chai.should(),
  validator = require('validator'),
  _ = require('underscore'),
  hypermediaResponse = require('../../api/hypermediaResponse');

describe('hypermediaResponse', function() {
  describe('when constructing a hypermedia response for digest', function() {
    var digestId = '7f74aa58-74e0-11e4-b116-123b93f75cba';
    var hypermedia = hypermediaResponse.digestPOST('http', 'localhost', digestId);

    // helpers
    function getLinkForRel(rel) {
      console.log(hypermedia._links)
      return _.find(hypermedia._links, function(element) { return element.rel === rel; });
    }

    function getLinkForRel(rel) {
      console.log(hypermedia._links)
      return _.find(hypermedia._links, function(element) { return element.rel === rel; });
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

    it('it\'s self link should reference the digest created.', function() {
      hypermedia._links['self'].should.have.property('href','http://localhost/api/digests/' + digestId);
    });

    // inbox-create link
    // it('it should link to an inbox resource to create an inbox', function() {
    //   hypermedia._links.should.include.key('inbox-create')
    // });

    // it('it should have an HTTP POST verb to create the inbox', function() {
    //   hypermedia._links['inbox-create'].should.have.property('method', 'POST');
    // });

    // it('it should have a reference to the inbox create resource', function() {
    //   hypermedia._links['inbox-create'].should.have.property('href', 'http://localhost/api/digests/' + digestId +'/inbox');
    // });

    // it('the link for inbox creation should have a description', function() {
    //   hypermedia._links['inbox-create'].should.have.property('title', 'Endpoint for creating an inbox for a repository on digest ' + digestId);
    // });

    // it('the inbox creation href should be a valid URL', function() {
    //     var inboxCreateLink = hypermedia._links['inbox-create'];
    //     validator.isURL(inboxCreateLink.href).should.be.true;
    // });

  })

//   describe('when constructing a hypermedia response for inbox', function() {
//     var hypermedia = hypermediaResponse.inbox('http', 'localhost', '7f74aa58-74e0-11e4-b116-123b93f75cba');

//     it('should have an href to the digest form', function() {
//       var link = _.find(hypermedia._links, function(element) { return element.rel === 'digest-form'; });
//       link.href.should.equal('http://localhost/api/digest/new');
//     });

//     it('inboxUrl should be a valid URI', function() {
//         validator.isURL(hypermedia.inboxUrl).should.be.true;
//     });

//     it('should have an id to identify the inbox', function() {
//       hypermedia.should.have.property('id');
//     });

//     it('id for a inbox should be a valid uuid', function() {
//       validator.isUUID(hypermedia.id).should.be.true;
//     });

//     it('inboxUrl should contain the id of the inbox', function() {
//       var inboxUrlParts = hypermedia.inboxUrl.split('/');
//       var id = inboxUrlParts[inboxUrlParts.length - 1];
//       id.should.equal(hypermedia.id);
//     });

//     it('should have links to other resources', function() {
//       hypermedia.should.include.key('_links');
//     });

//     it('it should have a link to itself', function() {
//       var selfLink = _.find(hypermedia._links, function(element) { return element.rel === 'self'; });
//       selfLink.should.have.property('rel', 'self');
//     });

//     it('it\'s self link should be to the appropriate href.', function() {
//       var selfLink = _.find(hypermedia._links, function(element) { return element.rel === 'self'; });
//       selfLink.should.have.property('href','http://localhost/api/inbox');
//     } );

//     // digest-form
//     it('should link to an digest form', function() {
//       var link = _.find(hypermedia._links, function(element) { return element.rel === 'digest-form'; });
//       link.should.have.property('rel', 'digest-form');
//     });

//     it('should have an HTTP GET verb to interract with the digest form ', function() {
//       var link = _.find(hypermedia._links, function(element) { return element.rel === 'digest-form'; });
//       link.should.have.property('method', 'GET');
//     });

//     it('link for digest form should have a description', function() {
//       var link = _.find(hypermedia._links, function(element) { return element.rel === 'digest-form'; });
//       link.should.have.property('description', 'Navigate to form for creating digest for a group of inboxes');
//     })
//   })
})