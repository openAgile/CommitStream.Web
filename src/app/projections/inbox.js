fromCategory('inbox')
  .foreachStream()
  .when({
    'InboxAdded': function(state, ev) {
      return ev;
    },
    'InboxRemoved': function(state, ev) {
      return ev;
    }
  });