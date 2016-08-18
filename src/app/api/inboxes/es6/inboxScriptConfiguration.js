import fs from 'fs';
import VcsFamilies from '../helpers/vcsFamilies';
import InboxhasNotScript from '../../middleware/inboxhasNotScript';
import InboxScriptRetrievedError from '../../middleware/inboxScriptRetrievedError';
//import scriptFileSender from '../helpers/scriptFileSender';

const getFileNameToRead = (platform) => {
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
	const fileToRead = getFileNameToRead(req.query.platform);
	fs.readFile("./api/inboxes/resources/" + fileToRead, 'utf8', function (err,data) {
		if (err) {
			console.log("err: " + err)
			throw new InboxScriptRetrievedError(err);
		}
		res = setOurHeaders(res, fileToRead);
		result = replaceValues(req, data);
		res.end(result);
	});
}

export default function(req, res) {
	if (VcsFamilies.Svn == req.inbox.family) {
		sendScriptFile(req, res);
	} else {
		throw new InboxhasNotScript();
	}
}
