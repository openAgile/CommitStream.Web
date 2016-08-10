import _ from 'underscore';
import fs from 'fs';
import VcsFamilies from '../helpers/vcsFamilies';
import InboxhasNotScript from '../../middleware/inboxhasNotScript';
import InboxScriptRetrievedError from '../../middleware/inboxScriptRetrievedError';

export default function(req, res) {
	if (VcsFamilies.Svn) {
		res.setHeader("content-type", "application/octet-stream");

		const apiKey = req.query.apiKey;
		const platform = req.query.platform;
		let result;
		let fileToRead = "commit-event.";
		fileToRead += platform == "windows" ? "ps1" : "sh";
		res.setHeader('Content-Disposition', 'attachment; filename="' + fileToRead + '"');
		fs.readFile("./api/inboxes/resources/" + fileToRead, 'utf8', function (err,data) {
			if (err) {
				throw new InboxScriptRetrievedError(err);
			}
			result = data.replace(/PLACE REPO URL HERE/g, req.inbox.name)
				.replace(/PLACE INBOX URL HERE/g, req.href("/api/" + req.instance.instanceId + "/inboxes/" + req.inbox.inboxId + "/commits?apiKey="+ apiKey));
			res.end(result);
		});
	} else {
		throw new InboxhasNotScript();
	}

}