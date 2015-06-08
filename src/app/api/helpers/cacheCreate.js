(function() {
  var Cache = require('ttl-cache');

  module.exports = function(ttl, interval) {
    ttl = ttl || 120;
    interval = interval || 60;
    return new Cache({
      ttl: ttl, // Number of seconds to keep entries
      interval: interval // Cleaning interval
    });
  };
}());