fromCategory('digest')
  .foreachStream()
  .when({
    'DigestAdded': function(state, ev) {
      return {
        instanceId: ev.data.instanceId,
        digestId: ev.data.digestId,
        description: ev.data.description
      };
    }
  });