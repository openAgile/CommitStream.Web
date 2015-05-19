fromCategory('digestInbox')
  .foreachStream()
  .when({
    '$init': function(state, ev) {
      return {
        inboxes: {}
      }
    },
    'InboxAdded': function(state, ev) {
      state.inboxes[ev.data.inboxId] = ev.data;
    },
    'InboxRemoved': function(state, ev) {
      delete state.inboxes[ev.data.inboxId];
    }
  });