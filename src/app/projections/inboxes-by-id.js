var callback = function (state, ev) {
	linkTo('inbox-' + ev.data.inboxId, ev);
};

fromCategory('inboxes').when({
	'InboxAdded': callback,
	'InboxRemoved': callback 
});