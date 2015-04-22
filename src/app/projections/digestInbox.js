var callback = function(state, ev) {
  linkTo('digestInbox-' + ev.data.digestId, ev);
};

fromCategory('inboxes').when({
  'InboxAdded': function(state, ev) {
    callback(state, ev);
  }
});