export default (req, res) => {
  const health = {status: 'healthy'};
  res.json(health);
};