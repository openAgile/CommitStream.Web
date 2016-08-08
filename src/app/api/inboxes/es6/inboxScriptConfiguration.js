import _ from 'underscore';
import fs from 'fs';

// function(req, res) {
//   if(req.url==="somethingorAnother") {
//     res.setHeader("content-type", "some/type");
//     fs.createReadStream("./toSomeFile").pipe(res);
//   }
// }
export default function(req, res) {
	res.setHeader("content-type", "application/octet-stream");
	fs.createReadStream("./api/inboxes/resources/commit-event.ps1").pipe(res);
}