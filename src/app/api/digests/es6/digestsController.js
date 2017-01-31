import digestCreate from './digestCreate';
import digestGet from './digestGet';
import digestCommitsGet from './digestCommitsGet';
import digestInboxesGet from './digestInboxesGet';
import bodyParser from 'body-parser';

export default {
  init(app) {
    app.post('/api/:instanceId/digests', bodyParser.json(), digestCreate);
    app.get('/api/:instanceId/digests/:digestId', digestGet);
    app.get('/api/:instanceId/digests', digestGet);
    app.get('/api/:instanceId/digests/:digestId/commits', digestCommitsGet);
    app.get('/api/:instanceId/digests/:digestId/inboxes', digestInboxesGet);    
  }
};
