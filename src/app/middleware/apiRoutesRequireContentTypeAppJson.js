(function() {
	module.exports = function(req, res, next) {    
    if (req.method !== 'POST') return next();
    if (!req.is('application/json')) {
      return res.status(415).send('When issuing a POST to the CommitStream API, you must send a Content-Type: application/json header.');
    } else {
      return next();
    }
  };
}());