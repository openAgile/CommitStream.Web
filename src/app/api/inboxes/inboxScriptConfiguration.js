'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _helpersVcsFamilies = require('../helpers/vcsFamilies');

var _helpersVcsFamilies2 = _interopRequireDefault(_helpersVcsFamilies);

var _middlewareInboxhasNotScript = require('../../middleware/inboxhasNotScript');

var _middlewareInboxhasNotScript2 = _interopRequireDefault(_middlewareInboxhasNotScript);

var _middlewareInboxScriptRetrievedError = require('../../middleware/inboxScriptRetrievedError');

var _middlewareInboxScriptRetrievedError2 = _interopRequireDefault(_middlewareInboxScriptRetrievedError);

var getFileNameToRead = function getFileNameToRead(platform) {
	return "commit-event." + (platform == "windows" ? "ps1" : "sh");
};

var setOurHeaders = function setOurHeaders(res, fileToRead) {
	res.setHeader("content-type", "application/octet-stream");
	res.setHeader('Content-Disposition', 'attachment; filename="' + fileToRead + '"');
	return res;
};

var replaceValues = function replaceValues(req, stream) {
	return stream.replace(/PLACE REPO URL HERE/g, req.inbox.name).replace(/PLACE INBOX URL HERE/g, req.href("/api/" + req.instance.instanceId + "/inboxes/" + req.inbox.inboxId + "/commits?apiKey=" + req.query.apiKey));
};

var sendScriptFile = function sendScriptFile(req, res) {
	var result = undefined;
	var fileToRead = getFileNameToRead(req.query.platform);
	_fs2['default'].readFile("./api/inboxes/resources/" + fileToRead, 'utf8', function (err, data) {
		if (err) {
			throw new _middlewareInboxScriptRetrievedError2['default'](err);
		}
		res = setOurHeaders(res, fileToRead);
		result = replaceValues(req, data);
		res.end(result);
	});
};

exports['default'] = function (req, res) {
	if (_helpersVcsFamilies2['default'].Svn) {
		sendScriptFile(req, res);
	} else {
		throw new _middlewareInboxhasNotScript2['default']();
	}
};

module.exports = exports['default'];
