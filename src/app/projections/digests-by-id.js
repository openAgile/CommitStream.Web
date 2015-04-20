var callback = function(state, ev) {
	linkTo('digest-' + ev.data.digestId, ev);
};

fromCategory('digests').when({
	'DigestAdded': callback
});