(function () {
	var inboxRemoved = require('./inboxRemoved'),
		eventStore = require('../helpers/eventStoreClient');

	module.exports = function (req, res) {
		var instanceId = req.instance.instanceId,
			inboxId = req.params.inboxId;

		eventStore.queryStatePartitionById({
			name: 'inbox',
			id: inboxId
		}).then(function (inbox) {
			var inboxRemovedEvent = inboxRemoved.create(instanceId, inbox.digestId, inboxId);
			var args = {
				name: 'inboxes-' + instanceId,
				events: inboxRemovedEvent
			};
			eventStore.postToStream(args).then(function () {
				res.status(200).json({ 'message': 'Your inbox has been succesfully removed.' });
			});
		});
	};

} ());