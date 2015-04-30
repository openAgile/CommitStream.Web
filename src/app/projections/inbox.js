fromCategory('inbox')
  .foreachStream()
  .when({
    'InboxAdded': function(state, ev) {
      return ev.data;
    }
  });