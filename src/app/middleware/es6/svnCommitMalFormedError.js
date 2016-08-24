import CsError from './csError';

class SvnCommitMalformedError extends CsError {
	constructor() {
		super(['There was an unexpected error when processing your Svn commit event.']);
	}
}

export default SvnCommitMalformedError;