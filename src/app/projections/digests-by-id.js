var callback = function (state, ev) {
	linkTo('digest-' + ev.data.digestId, ev);
};

fromStream('digests').when({ 
	'DigestAdded': callback 
});