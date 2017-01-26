import bodyParser from 'body-parser';

export default inboxesController(() =>{
     let init = ((app) => {
        app.post('/api/:instanceId/digests/:digestId/inboxes', bodyParser.json(), require('./inboxCreate'));

        app.post('/api/:instanceId/inboxes/:inboxId/commits', bodyParser.json({limit: '50mb'}	), require('./commitsCreate'));

        app.get('/api/:instanceId/inboxes/:inboxId', require('./inboxGet'));

        app.get('/api/:instanceId/inboxes/:inboxId/script', require('./inboxScriptConfiguration'));

        app.delete('/api/:instanceId/inboxes/:inboxId', require('./inboxRemove'));
    })
})
