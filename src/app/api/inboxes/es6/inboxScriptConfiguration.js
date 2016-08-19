import fs from 'fs';
import VcsFamilies from '../helpers/vcsFamilies';
import InboxHasNoScriptError from '../../middleware/inboxHasNoScriptError';
import InboxScriptRetrievedError from '../../middleware/inboxScriptRetrievedError';
import InboxScriptBadPlatformRequestedError from '../../middleware/inboxScriptBadPlatformRequestedError';

const validatePlatform = platform => (platform == "windows" || platform == "linux");

const getFileNameToRead = platform => {
	return "commit-event." + (platform == "windows" ? "ps1" : "sh");
}

const setOurHeaders = (res, fileToRead) => {
	res.setHeader("content-type", "application/octet-stream");
	res.setHeader('Content-Disposition', 'attachment; filename="' + fileToRead + '"');
	return res;
}

const replaceValues = (req, stream) => {
	return stream.replace(/PLACE REPO URL HERE/g, req.inbox.name)
			.replace(/PLACE INBOX URL HERE/g, req.href("/api/" + req.instance.instanceId + "/inboxes/" + req.inbox.inboxId + "/commits?apiKey="+ req.query.apiKey));
}

const sendScriptFile = (req, res) => {
	let result;
	let platform = req.query.platform;
	if (validatePlatform(platform)) {
		const fileToRead = getFileNameToRead(platform);
		fs.readFile("./api/inboxes/resources/" + fileToRead, 'utf8', function (err,data) {
			if (err) {
				throw new InboxScriptRetrievedError(err);
			}
			res = setOurHeaders(res, fileToRead);
			result = replaceValues(req, data);
			res.end(result);
		});
	} else {
		throw new InboxScriptBadPlatformRequestedError();
	}
}

export default function(req, res) {
	if (VcsFamilies.Svn == req.inbox.family) {
		sendScriptFile(req, res);
	} else {
		throw new InboxHasNoScriptError();
	}
}
