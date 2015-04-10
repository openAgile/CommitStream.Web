fromCategory('instance')
.foreachStream()
.when({
    'InstanceAdded': function(state, ev) {
        return ev.data;
    }
});