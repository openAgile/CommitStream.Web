'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function (req, res) {
  var health = { status: 'healthy' };
  res.json(health);
};

module.exports = exports['default'];
