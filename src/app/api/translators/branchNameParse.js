'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

exports['default'] = function (branchRef) {
	var separator = arguments.length <= 1 || arguments[1] === undefined ? '/' : arguments[1];
	var numberOfPrefixingShifts = arguments.length <= 2 || arguments[2] === undefined ? 2 : arguments[2];

	var branchParts = branchRef.split(separator);
	// knock off the prefixing stuff
	for (var i = 0; i < numberOfPrefixingShifts; i++) {
		branchParts.shift();
	}
	var branchName = undefined;
	if (branchParts.length > 1) branchName = branchParts.join(separator);else branchName = branchParts[0];
	return branchName;
};

module.exports = exports['default'];
