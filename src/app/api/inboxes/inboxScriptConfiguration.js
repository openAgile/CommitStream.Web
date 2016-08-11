'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _helpersVcsFamilies = require('../helpers/vcsFamilies');

var _helpersVcsFamilies2 = _interopRequireDefault(_helpersVcsFamilies);

// import InboxhasNotScript from '../../middleware/inboxhasNotScript';
// import InboxScriptRetrievedError from '../../middleware/inboxScriptRetrievedError';

var _helpersScriptFileSender = require('../helpers/scriptFileSender');

var _helpersScriptFileSender2 = _interopRequireDefault(_helpersScriptFileSender);

// const getFileNameToRead = (platform) => {
// 	return "commit-event." + (platform == "windows" ? "ps1" : "sh");
// }
//
// const setOurHeaders = (res, fileToRead) => {
// 	res.setHeader("content-type", "application/octet-stream");
// 	res.setHeader('Content-Disposition', 'attachment; filename="' + fileToRead + '"');
// 	return res;
// }
//
// const replaceValues = (req, stream) => {
// 	return stream.replace(/PLACE REPO URL HERE/g, req.inbox.name)
// 			.replace(/PLACE INBOX URL HERE/g, req.href("/api/" + req.instance.instanceId + "/inboxes/" + req.inbox.inboxId + "/commits?apiKey="+ req.query.apiKey));
// }
//
// const sendScriptFile = (req, res) => {
// 	let result;
// 	const fileToRead = getFileNameToRead(req.query.platform);
// 	fs.readFile("./api/inboxes/resources/" + fileToRead, 'utf8', function (err,data) {
// 		if (err) {
// 			throw new InboxScriptRetrievedError(err);
// 		}
// 		res = setOurHeaders(res, fileToRead);
// 		result = replaceValues(req, data);
// 		res.end(result);
// 	});
// }

var sendFile = function sendFile(fileObject, res) {
	setHeaders(res, fileObject.headers);
	res.end(fileObject.fileContent);
};

exports['default'] = function (req, res) {
	if (_helpersVcsFamilies2['default'].Svn == req.inbox.family) {

		getBitsForSvnFamily;
		getSvnHeadersAndFileContent;
		getSvnFileConfiguration;

		scriptFileSomething.getSvnHeadersAndFileContent;

		downloadFactory.getSvnResponse(res);

		scriptFileGenerator.getSvnScriptFile(req).then(function (fileObject) {
			sendFile(fileContent, res);
		});

		// sendScriptFile(req, res);
		// scriptFileSender.sendSvnScriptFile(req,res);
	} else {
			throw new InboxhasNotScript();
		}
};

module.exports = exports['default'];
