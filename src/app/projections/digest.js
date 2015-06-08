fromCategory('digest')
  .foreachStream()
  .when({
    'DigestAdded': function(state, ev) {
      return ev;
    }
  });