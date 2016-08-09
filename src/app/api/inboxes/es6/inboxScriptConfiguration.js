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
	// var reader = fs.createReadStream("./api/inboxes/resources/commit-event.ps1");
	// reader.pipe(res);

	var result;
	fs.readFile("./api/inboxes/resources/commit-event.ps1", 'utf8', function (err,data) {
		if (err) {
			return console.log(err);
		}
		console.log("DATA IS");
		console.log(data);

		result = data.replace(/PLACE REPO URL HERE/g, req.inbox.name);

		console.log("RESULT IS");
		console.log(result);
		res.end(result);

		// fs.writeFile(someFile, result, 'utf8', function (err) {
		// 	if (err) return console.log(err);
		// });
	});

}