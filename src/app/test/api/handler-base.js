(function() {
  var _ = require('underscore');

  module.exports = function(target) {  	
    if (target === undefined || target === null) target = global;
    var config = require('../../config'),
      chai = require('chai'),
      expect = chai.expect,      
      sinonChai = require('sinon-chai'),
      Bluebird = require('bluebird');

    config.eventStorePassword = '123';
    config.eventStoreUser = 'admin';
    config.eventStoreBaseUrl = 'http://nothing:7887';
    chai.use(sinonChai);
    chai.config.includeStack = true;

    var base = {
      _: _,
      chai: chai,
      expect: expect,
      should: chai.should(),
      sinon: require('sinon'),
      sinonChai: sinonChai,
      sinonAsPromised: require('sinon-as-promised')(Bluebird),
      httpMocks: require('node-mocks-http'),
      proxyquire: require('proxyquire').noPreserveCache(),
      uuid: require('uuid-v4')
    };

    _.extend(target, base);
  };
}());