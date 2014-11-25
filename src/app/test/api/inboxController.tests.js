var chai = require('chai'),
  should = chai.should(),
  controller = require('../../api/inboxController'),
  validator = require('validator');
  _ = require('underscore');
  // app = express(),
  // request = require('supertest'),
// express = require('express'),

chai.config.includeStack = true;

// controller.init(app);

// postInbox = function(shouldBehaveThusly) {
//   request(app)
//     .post('/api/inbox', 'myfirstinbox')
//     .end(shouldBehaveThusly);
// };

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

    it('should link to an digest form - v2', function() {
      hypermedia.should.have.deep.property('_links[0].rel', 'digest-form');
    });

    it('should link to an digest form - v2', function() {
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

// describe('inboxController', function () {
//   describe('when creating a inbox', function () {
//     it('inboxUrl should be a valid URI', function(done) {
//       postInbox(function(err, res) {
//         validator.isURL(res.body.inboxUrl).should.be.true;
//         done();
//       });
//     });

    // it('should have an id to identify the inbox', function(done) {
    //   postInbox(function(err, res) {
    //     var id = res.body.id;
    //     res.body.should.have.property('id');
    //     done();
    //   })
    // })

    // it('id for a inbox should be a valid uuid', function(done) {
    //   postInbox(function(err, res) {
    //     var id = res.body.id;
    //     validator.isUUID(id).should.be.true;
    //     done();
    //   })
    // })

    // it('inboxUrl should contain the id of the inbox', function(done) {
    //   postInbox(function(err, res) {
    //     var inboxUrlParts = res.body.inboxUrl.split('/');
    //     var id = inboxUrlParts[inboxUrlParts.length - 1];
    //     id.should.equal(res.body.id);
    //     done();
    //   });
    // });

    // it('should have links to other resources', function(done) {
    //   postInbox(function(err, res) {
    //     res.body.should.include.key('_links');
    //     done();
    //   })
    // })

    // it('should link to a digest form - v1', function(done) {
    //   postInbox(function(err, res) {
    //     res.body.should.have.deep.property('_links[0].rel', 'digest-form');
    //     done();
    //   })
    // })

    // it('should link to an digest form - v2', function(done) {
    //   postInbox(function(err, res) {
    //     var link = _.find(res.body._links, function(element) { return element.rel === 'digest-form'; });
    //     link.should.have.property('rel', 'digest-form');
    //     done();
    //   })
    // })

    // it('should have an HTTP GET verb to interract with the digest form ', function(done) {
    //   postInbox(function(err, res) {
    //     var link = _.find(res.body._links, function(element) { return element.rel === 'digest-form'; });
    //     link.should.have.property('method', 'GET');
    //     done();
    //   })
    // })

    // it('link for digest form should have a description', function(done) {
    //   postInbox(function(err, res) {
    //     var response = res.body;
    //     var link = _.find(response._links, function(element) { return element.rel === 'digest-form'; });
    //     link.should.have.property('description');
    //     done();
    //   })
    // })

//   });
// });
