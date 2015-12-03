'use strict';

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var fileExists = function fileExists(filePath) {
	try {
		return _fs2['default'].statSync(filePath).isFile();
	} catch (err) {
		return false;
	}
};

var filesConverted = [];
var filesRemaining = [];

(0, _glob2['default'])('**/*.js', {
	ignore: ['**/es6/**', '**/node_modules/**', '**/bower_components/**']
}, function (err, files) {
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = _getIterator(files), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var file = _step.value;

			var es6File = file.replace(/(.*)\/(.*)/, "$1/es6/$2");
			if (es6File.indexOf('/') === -1) es6File = 'es6/' + es6File;
			if (fileExists(es6File)) filesConverted.push(es6File);else filesRemaining.push(file);
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator['return']) {
				_iterator['return']();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	var summary = function summary() {
		console.log('\n');
		console.log('Total JS files: ', filesConverted.length + filesRemaining.length);
		console.log('Converted: ', filesConverted.length);
		console.log('Remaining: ', filesRemaining.length);
		console.log('% Completed: ', filesConverted.length / (filesConverted.length + filesRemaining.length));
		console.log('\n');
	};

	summary();

	console.log('Remaining:');
	console.log(filesRemaining);
	console.log('\n');
	console.log('Converted:');
	console.log(filesConverted);

	summary();
});
