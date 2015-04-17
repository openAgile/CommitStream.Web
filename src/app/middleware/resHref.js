(function() {
  var config = require('../config');

  function makeHref(req) {
    var protocol = config.protocol || req.protocol;
    var host = req.get('host');
    return function(path) {
      return protocol + "://" + host + path;
    };
  }

  module.exports = function(req, res, next) {
    req.href = makeHref(req);
    if (next) return next();
  }
}());