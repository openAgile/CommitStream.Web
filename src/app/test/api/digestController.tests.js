var chai = require('chai'),
  should = chai.should(),
  controller = require('../../api/digestController'),
  validator = require('validator');
  _ = require('underscore');

chai.config.includeStack = true;

describe('digestController', function() {
  describe('when constructing a hypermedia response', function() {
    var hypermedia = controller.constructHypermedia('http', 'localhost', '7f74aa58-74e0-11e4-b116-123b93f75cba');

    it('digestUrl should be a valid URI', function() {
        validator.isURL(hypermedia.digestUrl).should.be.true;
    });

    it('should have an id to identify the digest', function() {
        hypermedia.should.have.property('id');
    });

    it('id for a digest should be a valid uuid', function() {
      var id = hypermedia.id;
      validator.isUUID(id).should.be.true;
    });

    it('digestUrl should contain the id of the digest', function() {
      var digestUrlParts = hypermedia.digestUrl.split('/');
      var id = digestUrlParts[digestUrlParts.length - 1];
      id.should.equal(hypermedia.id);
    });

    it('should have links to other resources', function() {
      hypermedia.should.include.key('_links');
    });

    it('should link to an inbox form', function() {
      var link = _.find(hypermedia._links, function(element) { return element.rel === 'inbox-form'; });
      link.should.have.property('rel', 'inbox-form');
    });

    it('should have an HTTP GET verb to interract with the inbox form ', function() {
      var link = _.find(hypermedia._links, function(element) { return element.rel === 'inbox-form'; });
      link.should.have.property('method', 'GET');
    });

    it('should have a reference to the inbox form', function() {
      var link = _.find(hypermedia._links, function(element) { return element.rel === 'inbox-form'; });
      link.should.have.property('href', hypermedia.digestUrl + '/inbox/new');
    });

    it('link for inbox form should have a description', function() {
      var link = _.find(hypermedia._links, function(element) { return element.rel === 'inbox-form'; });
      link.should.have.property('description', 'Navigate to form for creating an inbox for a repository');
    });

  })
})

// see jsonpath, appcatalog has some in it appcatalogentry.schema
// {
//   "digestUrl": "http://host/api/digest/1f1aa47629c44116a3ca08a9bb911309",
//   "_links": [
//     {
//     "href": "http://host/api/digest/1f1aa47629c44116a3ca08a9bb911309/inbox/new",
//     "rel": "inbox",
//     "name": "Navigate to form for creating an inbox for a repository",
//     "method": "GET"
//     }
//   ]
// }


// {
//   'digest' : {
//     'id' : '1f1aa47629c44116a3ca08a9bb911309',
//     'href' : 'http://host/api/digest/',
//     'links' : {
//       'inbox' : {
//         'href' : ''
//       }
//     }
//   }
// }