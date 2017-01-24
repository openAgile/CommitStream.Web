export default (req, res, next) => {
  res.hal = (halData, statusCode=200) => {
    res.location(halData._links.self.href);
    res.set('Content-Type', 'application/hal+json');
    res.status(statusCode);
    res.send(halData);
  };
  if (next) return next();
};