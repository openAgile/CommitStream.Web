var callback = function (state, ev) {
	linkTo('inbox-' + ev.data.inboxId, ev);
};

fromStream('inboxes').when({ 
	'InboxAdded': callback 
});