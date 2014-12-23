fromCategory('digest')
.foreachStream()
.when({
    'DigestAdded': function(state, ev) {
        return {
            digestId: ev.data.digestId,
            description: ev.data.description
        }
    }
});