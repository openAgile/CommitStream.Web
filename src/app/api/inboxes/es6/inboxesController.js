import bodyParser from 'body-parser';
import inboxCreate from './inboxCreate';
import commitsCreate from './commitsCreate';
import inboxGet from './inboxGet';
import inboxScriptConfiguration from './inboxScriptConfiguration';
import inboxRemove from './inboxRemove';
import catchAsyncErrors from '../../middleware/catchAsyncErrors';

export default {
     init (app) {
        app.post('/api/:instanceId/digests/:digestId/inboxes', bodyParser.json(), inboxCreate);
        app.post('/api/:instanceId/inboxes/:inboxId/commits', bodyParser.json({limit: '50mb'}), catchAsyncErrors(commitsCreate));
        app.get('/api/:instanceId/inboxes/:inboxId', inboxGet);
        app.get('/api/:instanceId/inboxes/:inboxId/script', inboxScriptConfiguration);
        app.delete('/api/:instanceId/inboxes/:inboxId', inboxRemove);
    }
}