
import commitsGet from '../helpers/commitsGet';
import cacheCreate from '../helpers/cacheCreate';

const cache = cacheCreate();

export default async (req, res) => {
  const digestId = req.params.digestId;
 const instanceId = req.instance.instanceId;
 const buildUri = page => req.href(`/api/${instanceId}/digests/${digestId}/commits?page=${page}&apiKey=${req.instance.apiKey}`); 
 const stream = `digestCommits-${digestId}`;
 const commits = await commitsGet(req.query, stream, buildUri, cache);
 res.send(commits);
}
