'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function (req, res, next) {
  res.hal = function (halData) {
    var statusCode = arguments.length <= 1 || arguments[1] === undefined ? 200 : arguments[1];

    res.location(halData._links.self.href);
    res.set('Content-Type', 'application/hal+json');
    res.status(statusCode);
    res.send(halData);
  };
  if (next) return next();
};

module.exports = exports['default'];
