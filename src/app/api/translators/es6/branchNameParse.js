export default (branchRef, separator='/', numberOfPrefixingShifts=2) => {
	let branchParts = branchRef.split(separator);
	// knock off the prefixing stuff
	for(let i = 0; i < numberOfPrefixingShifts; i++) {
		branchParts.shift();
	}
	let branchName;
	if (branchParts.length > 1) branchName = branchParts.join(separator);
	else branchName = branchParts[0];
	return branchName;
};