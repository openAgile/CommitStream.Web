import instanceCommitGet from './instanceFormatAsHal';

export default (req, res) => {
	res.hal(instanceFormatAsHal(req.href, req.instance));
};