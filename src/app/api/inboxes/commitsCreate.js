'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _validateUUID = require('../validateUUID');

var _validateUUID2 = _interopRequireDefault(_validateUUID);

var _helpersEventStoreClient = require('../helpers/eventStoreClient');

var _helpersEventStoreClient2 = _interopRequireDefault(_helpersEventStoreClient);

var _translatorsTranslatorFactory = require('../translators/translatorFactory');

var _translatorsTranslatorFactory2 = _interopRequireDefault(_translatorsTranslatorFactory);

var _respondersResponderFactory = require('../responders/responderFactory');

var _respondersResponderFactory2 = _interopRequireDefault(_respondersResponderFactory);

var _commitsAddedFormatAsHal = require('./commitsAddedFormatAsHal');

var _commitsAddedFormatAsHal2 = _interopRequireDefault(_commitsAddedFormatAsHal);

var _middlewareMalformedPushEventError = require('../../middleware/malformedPushEventError');

var _middlewareMalformedPushEventError2 = _interopRequireDefault(_middlewareMalformedPushEventError);

exports['default'] = function (req, res) {
    var instanceId = req.instance.instanceId;
    var digestId = req.inbox.digestId;
    var inboxId = req.params.inboxId;

    (0, _validateUUID2['default'])('inbox', inboxId);

    var translator = _translatorsTranslatorFactory2['default'].create(req);

    if (translator) {
        var events = translator.translatePush(req.body, instanceId, digestId, inboxId);
        var postArgs = {
            name: 'inboxCommits-' + inboxId,
            events: events
        };

        return _helpersEventStoreClient2['default'].postToStream(postArgs).then(function () {
            var inboxData = {
                inboxId: inboxId,
                digestId: digestId
            };

            var hypermedia = (0, _commitsAddedFormatAsHal2['default'])(req.href, instanceId, inboxData);
            res.hal(hypermedia, 201);
        });
    } else {
        var responder = _respondersResponderFactory2['default'].create(req);
        if (responder) {
            return responder.respond(res);
        } else {
            throw new _middlewareMalformedPushEventError2['default'](req);
        }
    }
};

module.exports = exports['default'];
