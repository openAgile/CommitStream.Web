'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _helpersVcsFamilies = require('../helpers/vcsFamilies');

var _helpersVcsFamilies2 = _interopRequireDefault(_helpersVcsFamilies);

var _middlewareInboxHasNoScriptError = require('../../middleware/inboxHasNoScriptError');

var _middlewareInboxHasNoScriptError2 = _interopRequireDefault(_middlewareInboxHasNoScriptError);

var _middlewareInboxScriptRetrievedError = require('../../middleware/inboxScriptRetrievedError');

var _middlewareInboxScriptRetrievedError2 = _interopRequireDefault(_middlewareInboxScriptRetrievedError);

var _middlewareInboxScriptBadPlatformRequestedError = require('../../middleware/inboxScriptBadPlatformRequestedError');

var _middlewareInboxScriptBadPlatformRequestedError2 = _interopRequireDefault(_middlewareInboxScriptBadPlatformRequestedError);

var validatePlatform = function validatePlatform(platform) {
	return platform == "windows" || platform == "linux";
};

var getFileNameToRead = function getFileNameToRead(platform) {
	return "commit-event." + (platform == "windows" ? "ps1" : "sh");
};

var setOurHeaders = function setOurHeaders(res, fileToRead) {
	res.setHeader("content-type", "application/octet-stream");
	res.setHeader('Content-Disposition', 'attachment; filename="' + fileToRead + '"');
	return res;
};

var replaceValues = function replaceValues(req, contentString, platform) {
	contentString.replace(/PLACE REPO URL HERE/g, req.inbox.url).replace(/PLACE INBOX URL HERE/g, req.href("/api/" + req.instance.instanceId + "/inboxes/" + req.inbox.inboxId + "/commits?apiKey=" + req.query.apiKey));
	if (platform == "linux") {
		contentString.replace('\r', '');
	}
	return contentString;
};

var sendScriptFile = function sendScriptFile(req, res) {
	var result = undefined;
	var platform = req.query.platform;
	if (validatePlatform(platform)) {
		(function () {
			var fileToRead = getFileNameToRead(platform);
			_fs2['default'].readFile("./api/inboxes/resources/" + req.inbox.family.toLowerCase() + '/' + fileToRead, 'utf8', function (err, data) {
				if (err) {
					throw new _middlewareInboxScriptRetrievedError2['default'](err);
				}
				res = setOurHeaders(res, fileToRead);
				result = replaceValues(req, data);
				res.end(result);
			});
		})();
	} else {
		throw new _middlewareInboxScriptBadPlatformRequestedError2['default']();
	}
};

exports['default'] = function (req, res) {
	if (_helpersVcsFamilies2['default'].Svn == req.inbox.family || _helpersVcsFamilies2['default'].P4V == req.inbox.family) {
		sendScriptFile(req, res);
	} else {
		throw new _middlewareInboxHasNoScriptError2['default']();
	}
};

module.exports = exports['default'];
