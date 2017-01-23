import config from '../config';

const makeHref = req => {
  const protocol = config.protocol || req.protocol;
  const host = req.get('host');
  return path => `${protocol}://${host}${path}`;
};

export default (req, res, next) => { 
  req.href = makeHref(req);
  if (next) return next();
};