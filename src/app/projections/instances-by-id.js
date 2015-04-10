var callback = function (state, ev) {
	linkTo('instance-' + ev.data.instanceId, ev);
};

fromStream('instances').when({ 
	'InstanceAdded': callback 
});