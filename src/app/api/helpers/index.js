(function (helpers) {
	helpers.getHttpResources = function (options, next) {
		var http = require('http');

		callback = function(response) {
		  var result = "";

		  //another chunk of data has been recieved, so append it to `result`
		  response.on('data', function (chunk) {
		    result += chunk;
		  });

		  //the whole response has been recieved, so i return the commit
		  response.on('end', function () {
			var commit = JSON.parse(result);	
			next("null", commit);
		  });
		}
		
		http.request(options, callback).end();
	};

	helpers.getHttpsResources = function (options, next) {
		var https = require('https');

		callback = function (response) {
			var result = "";

		  //another chunk of data has been recieved, so append it to `result`
		  response.on('data', function (chunk) {
		    result += chunk;
		  });

		  //the whole response has been recieved, so i return the unprocessed commits
		  response.on('end', function () {
			var commits = JSON.parse(result);	
			next("null", commits);
		  });		
		};
		https.request(options, callback).end();
	};

})(module.exports);