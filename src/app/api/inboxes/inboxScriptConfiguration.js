'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

// function(req, res) {
//   if(req.url==="somethingorAnother") {
//     res.setHeader("content-type", "some/type");
//     fs.createReadStream("./toSomeFile").pipe(res);
//   }
// }

exports['default'] = function (req, res) {
	res.setHeader("content-type", "application/octet-stream");
	_fs2['default'].createReadStream("./api/inboxes/resources/commit-event.ps1").pipe(res);
};

module.exports = exports['default'];
