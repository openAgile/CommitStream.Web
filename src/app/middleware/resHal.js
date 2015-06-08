(function(module) {
  module.exports = function(req, res, next) {
    res.hal = function(halData, statusCode) {
      statusCode = statusCode || 200;
      res.location(halData._links.self.href);
      res.set('Content-Type', 'application/hal+json');
      res.status(statusCode);
      res.send(halData);
    };
    if (next) return next();
  };
}(module));