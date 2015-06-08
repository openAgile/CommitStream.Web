var chai = require('chai'),
  should = chai.should,
  sinon = require('sinon');


var resHal = require('../../middleware/resHal'),
  res,
  next;

res = {
  location: sinon.stub(),
  set: sinon.stub(),
  status: sinon.stub(),
  send: sinon.stub()
};

next = sinon.spy();

describe('resHal', function() {
  describe('when calling the middleware', function() {

    resHal({}, res, next);

    it('should set the function for res.hal', function() {
      (typeof res.hal).should.be.equal('function');
    });

    describe('when calling res.hal', function() {
      var halData = {
        meh: {},
        _links: {
          self: {
            href: sinon.spy()
          }
        }
      };

      res.hal(halData);

      it('should call res.location with correct args', function() {
        res.location.should.have.been.calledWith(halData._links.self.href);
      });

      it('should call res.set with correct args', function() {
        res.set.should.have.been.calledWith('Content-Type', 'application/hal+json');
      });

      it('should call res.status with correct args', function() {
        res.status.should.have.been.calledWith(200);
      });

      it('should call res.send with correct args', function() {
        res.send.should.have.been.calledWith(halData);
      });

      it('should call next once', function() {
        next.should.have.been.calledOnce;
      });

    });
  });

});