import digestCreate from './digestCreate';
import digestGet from './digestGet';
import digestsGet from './digestsGet';
import digestCommitsGet from './digestCommitsGet';
import digestInboxesGet from './digestInboxesGet';
import bodyParser from 'body-parser';

export default {
  init(app) {
    app.post('/api/:instanceId/digests', bodyParser.json(), digestCreate);
    app.get('/api/:instanceId/digests/:digestId', digestGet);
    app.get('/api/:instanceId/digests', digestsGet);
    app.get('/api/:instanceId/digests/:digestId/commits', digestCommitsGet);
    app.get('/api/:instanceId/digests/:digestId/inboxes', digestInboxesGet);    
  }
};
