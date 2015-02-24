(function(urls) {
  var config = require('../config');
  
  urls.href = function href(req) {
    var protocol = config.protocol || req.protocol;
    var host = req.get('host');    
    return function(path) {      
      return protocol + "://" + host + path;
   };
  };

})(module.exports);