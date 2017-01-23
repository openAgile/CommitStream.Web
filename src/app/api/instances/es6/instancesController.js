import instanceCreate from './instanceCreate';
import instanceGet from './instanceCommitsGet';
import instanceCommitGet from './instanceCommitsGet';

((instancesController => {
	instancesController.init = (app) => {
    app.post('/api/instances', instanceCreate);
    app.get('/api/instances/:instanceId', instanceGet);
    app.get('/api/:instanceId/commits/tags/versionone/workitem', instanceCommitGet);
  };
})(module.exports))