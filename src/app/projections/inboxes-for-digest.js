fromCategory('digestInbox')
.foreachStream()
.when({
  '$init': function (state, ev) {
    return { inboxes: {} }
  },
  'InboxAdded': function (state, ev) {
    state.inboxes[ev.data.inboxId] = ev.data;
  }
});