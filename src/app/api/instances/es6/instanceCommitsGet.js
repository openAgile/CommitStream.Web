import commitsGet from '../helpers/commitsGet';
import cacheCreate from '../helpers/cacheCreate';
import commitsChildrenGet from '../helpers/commitsChildrenGet';
import _ from 'underscore';

let cache = cacheCreate();

export default function(req, res) {
  let workitems = req.params.workitems;
  let instanceId = req.instance.instanceId;

  let buildUri = (page) =>
    req.href('/api/' + instanceId + '/commits/tags/versionone/workitems/' +
      workitems + '?page=' + page + '&apiKey=' + req.instance.apiKey);

  let workitemsArray = workitems.split(',');

  if (workitemsArray.length === 1) {
    let stream = 'versionOne_CommitsWithWorkitems-' + instanceId + '_' + workitems;

    commitsGet(req.query, stream, buildUri, cache).then(function(commits) {
      // TODO use hal?
      res.send(commits);
    });
  } else {
    let streams = [];
    _.each(workitemsArray, function(e, i) {
      streams.push('versionOne_CommitsWithWorkitems-' + instanceId + '_' + e);
    });
    commitsChildrenGet(req.query, streams, buildUri).then(function(commits) {
      res.send(commits);
    });
  }
}
