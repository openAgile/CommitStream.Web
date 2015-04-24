(function() {
  var instanceFormatAsHal = require('./instanceFormatAsHal');

  module.exports = function(req, res) {
    res.hal(instanceFormatAsHal(req.href, req.instance));
  };
}());